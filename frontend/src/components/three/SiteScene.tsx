import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { scrollState } from '@/lib/scrollState'
import type { Theme } from '@/hooks/useTheme'

/**
 * Sayfanın tamamının arkasında yaşayan tek WebGL sahnesi.
 *
 * Eski kurulumda sahne yalnızca hero'nun arkasındaydı ve kaydırınca geride
 * kalıyordu. Bu sürümde sahne sayfa boyunca sürüyor: kaydırma ilerlemesi
 * kamerayı ileri taşıyor, parçacık alanını akıtıyor ve renk geçişini
 * sürüyor. Böylece aşağı indikçe aynı mekânın içinde ilerliyormuş hissi oluşuyor.
 *
 * Sahne tamamen dekoratiftir: `aria-hidden`, `pointer-events: none` ve
 * yalnızca `allow3d` koşulunda yüklenir (bkz. `SceneBackdrop`).
 *
 * Performans sınırları:
 * - Tek Canvas, tek geometri seti; bölüm başına yeni sahne kurulmaz.
 * - Parçacıklar GPU'da yer değiştirir (CPU her karede pozisyon yazmaz).
 * - Sekme arka plandayken `frameloop="never"` ile kare üretimi tamamen durur.
 */

/* -------------------------------------------------------------------------
   Palet — tasarım sistemindeki vurgu renkleriyle birebir aynı.
------------------------------------------------------------------------- */
const COLOR_NEAR = new THREE.Color('#3d9bff')
const COLOR_FAR = new THREE.Color('#1b3a8f')
const COLOR_PULSE = new THREE.Color('#22d3ee')
const COLOR_DEEP = new THREE.Color('#8b5cf6')

/** Izgaranın bir kenarındaki nokta sayısı. 120² = 14.400 parçacık. */
const GRID = 120
/** Izgaranın dünya birimi cinsinden genişliği/derinliği. */
const SPAN = 70

/**
 * Tohumdan üretilen sözde-rastgele sayı, 0–1.
 *
 * `Math.random` yerine bu kullanılıyor çünkü geometri render sırasında
 * kuruluyor: rastgelelik her yeniden kurulumda farklı bir ızgara üretirdi
 * (ve React Compiler saf olmayan çağrıyı haklı olarak reddediyor). Aynı
 * tohum her zaman aynı alanı verir; sahne yeniden kurulduğunda parçacıklar
 * yerinden oynamaz.
 */
function seededRandom(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uPointer;
  uniform float uSpan;

  attribute float aRand;

  varying float vFade;
  varying float vRipple;
  varying float vRand;

  void main() {
    vec3 pos = position;

    // İki farklı frekansta dalga: tek sinüs çok düzenli, "ekran koruyucu"
    // gibi duruyordu. İkisinin çarpımı düzensiz ama sakin bir yüzey veriyor.
    float wave =
      sin(pos.x * 0.16 + uTime * 0.35) *
      cos(pos.z * 0.13 - uTime * 0.22);
    pos.y += wave * 1.7;

    // İşaretçinin altındaki alan yukarı kabarır. Üstel düşüş sayesinde etki
    // dar bir çevrede kalır, tüm ızgarayı sürüklemez.
    vec2 pointerWorld = uPointer * (uSpan * 0.32);
    float pointerDist = distance(pos.xz, pointerWorld);
    float ripple = exp(-pointerDist * 0.09);
    pos.y += ripple * 3.4;

    // Sonsuz akış: kaydırma ilerlemesi ızgarayı z ekseninde kaydırır ve
    // taşan sıralar başa sarılır (mod). Kamera hep aynı yerde kalsa bile
    // içinden geçiliyormuş hissi bundan doğuyor.
    pos.z = mod(pos.z + uScroll * uSpan * 2.4 + uSpan * 0.5, uSpan) - uSpan * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float dist = -mvPosition.z;
    // Perspektife göre nokta boyutu: uzaktakiler küçülür.
    gl_PointSize = (16.0 + aRand * 20.0) / max(dist, 1.0);

    // Uzakta sönümlenme + çok yakında da sönümlenme (kameraya çarpan
    // parçacıklar dev lekelere dönüşmesin diye).
    vFade = smoothstep(90.0, 22.0, dist) * smoothstep(2.0, 9.0, dist);
    vRipple = ripple;
    vRand = aRand;
  }
`

const particleFragmentShader = /* glsl */ `
  uniform vec3  uColorNear;
  uniform vec3  uColorFar;
  uniform vec3  uColorPulse;
  uniform float uOpacity;

  varying float vFade;
  varying float vRipple;
  varying float vRand;

  void main() {
    // Kare noktayı yumuşak bir diske çeviriyoruz; kenarı sert bırakınca
    // ızgara "piksel" gibi görünüyordu.
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.08, d);
    if (alpha < 0.01) discard;

    vec3 color = mix(uColorFar, uColorNear, vRand);
    color = mix(color, uColorPulse, vRipple * 0.85);

    gl_FragColor = vec4(color, alpha * vFade * uOpacity);
  }
`

/** Kaydırmayla akan, işaretçiye tepki veren parçacık ızgarası. */
function ParticleField() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const count = GRID * GRID
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const column = i % GRID
      const row = Math.floor(i / GRID)

      // Izgarayı merkeze oturtuyoruz; her noktaya küçük bir düzensizlik
      // ekliyoruz ki mükemmel hizalı satırlar moiré deseni üretmesin.
      const jitterX = (seededRandom(i) - 0.5) * (SPAN / GRID) * 0.9
      const jitterZ = (seededRandom(i + 9973) - 0.5) * (SPAN / GRID) * 0.9

      positions[i * 3] = (column / (GRID - 1) - 0.5) * SPAN + jitterX
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = (row / (GRID - 1) - 0.5) * SPAN + jitterZ
      randoms[i] = seededRandom(i + 27644)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aRand', new THREE.BufferAttribute(randoms, 1))
    // Parçacıklar shader'da yer değiştirdiği için otomatik sınırlayıcı küre
    // yanlış hesaplanır ve alan erken kırpılır; elle geniş tutuyoruz.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), SPAN)
    return geo
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uSpan: { value: SPAN },
      uColorNear: { value: COLOR_NEAR.clone() },
      uColorFar: { value: COLOR_FAR.clone() },
      uColorPulse: { value: COLOR_PULSE.clone() },
      uOpacity: { value: 0.85 },
    }),
    [],
  )

  // Yumuşatılmış işaretçi: ham değer verilirse dalga fare ile birlikte zıplar.
  const smoothPointer = useRef(new THREE.Vector2(0, 0))

  useFrame((_, delta) => {
    const material = materialRef.current
    if (!material) return

    // Uniform'lar materyalin kendi nesnesi üzerinden güncellenir. `useMemo`
    // ile üretilen nesneyi doğrudan değiştirmek, hook'tan dönen bir değeri
    // render sonrası mutasyona uğratmak olurdu; materyal ise bir ref üzerinden
    // geliyor ve imperatif güncelleme için doğru sahibi o.
    const u = material.uniforms

    // `delta` çok büyük gelebilir (sekme geri geldiğinde); sıçramayı kesiyoruz.
    const step = Math.min(delta, 0.05)

    u.uTime.value += step
    u.uScroll.value = scrollState.progress

    const pointer = smoothPointer.current
    pointer.x += (scrollState.pointerX - pointer.x) * 0.06
    pointer.y += (scrollState.pointerY - pointer.y) * 0.06
    u.uPointer.value.set(pointer.x, -pointer.y)

    // Sayfa aşağı indikçe palet maviden mora kayar: bölümler arasında
    // fark edilir ama isim koyulamayan bir renk seyri oluşur.
    u.uColorNear.value.copy(COLOR_NEAR).lerp(COLOR_DEEP, scrollState.progress * 0.75)
    u.uColorPulse.value.copy(COLOR_PULSE).lerp(COLOR_NEAR, scrollState.progress * 0.5)
  })

  return (
    <points
      geometry={geometry}
      frustumCulled={false}
      rotation={[-0.32, 0, 0]}
      position={[0, -7, 0]}
    >
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * Uzayda süzülen tel kafes hacimler.
 *
 * "Mavi Baskı" konseptinin 3B karşılığı: kütleleri değil konturları görüyoruz.
 * Kaydırma her birini farklı hızda döndürüp ölçekler, böylece sayfa boyunca
 * sürekli değişen bir siluet oluşur.
 */
function WireFrames() {
  const group = useRef<THREE.Group>(null)
  const icosahedron = useRef<THREE.LineSegments>(null)
  const torus = useRef<THREE.LineSegments>(null)
  const box = useRef<THREE.LineSegments>(null)

  const geometries = useMemo(
    () => ({
      icosahedron: new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(4.2, 1)),
      torus: new THREE.EdgesGeometry(new THREE.TorusGeometry(3.1, 0.9, 8, 22)),
      box: new THREE.EdgesGeometry(new THREE.BoxGeometry(3.4, 3.4, 3.4, 2, 2, 2)),
    }),
    [],
  )

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05)
    const progress = scrollState.progress
    const t = state.clock.elapsedTime

    if (group.current) {
      // Tüm küme kaydırmayla kameraya yaklaşır ve hafifçe yana kayar.
      group.current.position.z = -26 + progress * 20
      group.current.position.x = Math.sin(progress * Math.PI * 1.5) * 5
      group.current.rotation.y = progress * 1.4 + scrollState.pointerX * 0.12
    }

    if (icosahedron.current) {
      icosahedron.current.rotation.y += step * 0.14
      icosahedron.current.rotation.x = Math.sin(t * 0.18) * 0.3
      // Kaydırdıkça açılıp kapanan nefes.
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.22
      icosahedron.current.scale.setScalar(scale)
    }

    if (torus.current) {
      torus.current.rotation.x += step * 0.2
      torus.current.rotation.z = progress * 2.2
    }

    if (box.current) {
      box.current.rotation.y -= step * 0.1
      box.current.rotation.z = Math.cos(t * 0.14) * 0.4
    }
  })

  return (
    <group ref={group}>
      <lineSegments ref={icosahedron} geometry={geometries.icosahedron} position={[-9, 3.5, 0]}>
        <lineBasicMaterial color="#3d9bff" transparent opacity={0.24} depthWrite={false} />
      </lineSegments>

      <lineSegments ref={torus} geometry={geometries.torus} position={[10, -2.5, -6]}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.2} depthWrite={false} />
      </lineSegments>

      <lineSegments ref={box} geometry={geometries.box} position={[2, 7, -12]}>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

/**
 * Kamera düzeneği.
 *
 * Kaydırma kamerayı ileri sürer ve bakış açısını yavaşça alçaltır; işaretçi
 * ise küçük bir parallax ekler. İkisi de `lerp` ile yumuşatılır — doğrudan
 * atama yapılırsa Lenis'in kendi yumuşatmasıyla çakışıp titriyor.
 */
function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0, 0))

  // Kamera `useThree()` yerine kare durumundan alınır: hook'tan dönen nesneyi
  // her karede değiştirmek yerine, R3F'in kareye özel verdiği referans üzerinde
  // çalışıyoruz. Davranış aynı, sahiplik doğru yerde.
  useFrame((state) => {
    const camera = state.camera
    const progress = scrollState.progress

    const desiredX = scrollState.pointerX * 2.2
    const desiredY = 1.5 + scrollState.pointerY * 1.2 - progress * 3.2
    const desiredZ = 20 - progress * 6

    camera.position.x += (desiredX - camera.position.x) * 0.045
    camera.position.y += (desiredY - camera.position.y) * 0.045
    camera.position.z += (desiredZ - camera.position.z) * 0.045

    target.current.set(0, -progress * 2, -10)
    camera.lookAt(target.current)
  })

  return null
}

type SiteSceneProps = {
  /** Sekme görünmüyorsa render döngüsü tamamen durur. */
  active: boolean
  theme: Theme
}

export default function SiteScene({ active, theme }: SiteSceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      // R3F sarmalayıcıya `position: relative; pointer-events: auto` inline
      // stili basar; sahne dekoratif olduğu için ikisini de eziyoruz.
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 1.5, 20], fov: 46, near: 0.1, far: 160 }}
      gl={{
        antialias: true,
        alpha: true,
        depth: true,
        stencil: false,
        powerPreference: 'high-performance',
      }}
      // Yüksek yoğunluklu ekranlarda tel kafesleri ve parçacıkları fiziksel pikselde
      // çizer; 2x sınırı, yüksek tazeleme hızını korurken Retina keskinliği verir.
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = theme === 'light' ? 1.02 : 1.12
      }}
    >
      <CameraRig />
      <ParticleField />
      <WireFrames />
      {/* Uzaklaşan her şeyi zemine bağlayan sis — sahnenin kenarları
          kesilmek yerine karanlığa karışır. */}
      <fog attach="fog" args={[theme === 'light' ? '#f4f6fa' : '#02040a', 34, 105]} />
    </Canvas>
  )
}

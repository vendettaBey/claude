export function HeroOrbit() {
  return (
    <div className="kinetic-scene" aria-hidden="true">
      <div className="kinetic-halo" />
      <div className="kinetic-floor" />

      <div className="kinetic-engine">
        <div className="orbit-plane plane-one">
          <div className="orbit-ring ring-one">
            <i className="electron electron-hot" />
            <i className="electron electron-small" />
            <i className="electron" />
            <i className="electron electron-dim" />
          </div>
        </div>
        <div className="orbit-plane plane-two">
          <div className="orbit-ring ring-two">
            <i className="electron" />
            <i className="electron electron-hot" />
            <i className="electron electron-small" />
          </div>
        </div>
        <div className="orbit-plane plane-three">
          <div className="orbit-ring ring-three">
            <i className="electron electron-small" />
            <i className="electron" />
            <i className="electron electron-dim" />
            <i className="electron electron-hot" />
            <i className="electron electron-small" />
          </div>
        </div>
        <div className="kinetic-cube">
          <span className="cube-face face-front">
            <b>STRATEJİ</b>
          </span>
          <span className="cube-face face-back">
            <b>ÜRÜN</b>
          </span>
          <span className="cube-face face-right">
            <b>KOD</b>
          </span>
          <span className="cube-face face-left">
            <b>ARAYÜZ</b>
          </span>
          <span className="cube-face face-top" />
          <span className="cube-face face-bottom" />
        </div>

        <div className="kinetic-core">
          <i />
          <span />
        </div>
      </div>

      <span className="satellite satellite-a">
        <i>01</i> STRATEJİ
      </span>
      <span className="satellite satellite-b">
        <i>02</i> TASARIM
      </span>
      <span className="satellite satellite-c">
        <i>03</i> YAZILIM
      </span>
      <span className="kinetic-status">
        <i /> CANLI DİJİTAL DENEYİM
      </span>
      <span className="kinetic-caption">
        FİKİR → ETKİ
        <br />
        00.01 / STUDIO
      </span>
    </div>
  )
}

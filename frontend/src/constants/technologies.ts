import type { Technology } from '@/types'

/**
 * Listede yalnızca bu projede gerçekten kullanılan / projelerde kullandığımız
 * teknolojiler yer alır. Inertia.js bu mimaride kullanılmadığı için yoktur.
 */
export const technologies: Technology[] = [
  {
    name: 'Laravel',
    mark: 'laravel',
    description:
      'Güvenli ve ölçeklenebilir backend sistemleri geliştirmek için kullanılan PHP çatısı',
    color: '#ff5b4a',
  },
  {
    name: 'PHP',
    mark: 'php',
    description: 'Sunucu tarafında çalışan, yaygın desteklenen ve olgun programlama dili',
    color: '#8b93d6',
  },
  {
    name: 'React',
    mark: 'react',
    description:
      'Hızlı ve etkileşimli kullanıcı arayüzleri geliştirmek için kullanılan JavaScript kütüphanesi',
    color: '#61dafb',
  },
  {
    name: 'TypeScript',
    mark: 'typescript',
    description: 'Daha güvenli ve sürdürülebilir frontend kodu yazılmasını sağlayan tip sistemi',
    color: '#3178c6',
  },
  {
    name: 'JavaScript',
    mark: 'javascript',
    description: 'Tarayıcıda çalışan etkileşimli arayüzlerin temelini oluşturan programlama dili',
    color: '#f0db4f',
  },
  {
    name: 'Tailwind CSS',
    mark: 'tailwind',
    description: 'Tutarlı ve bakımı kolay arayüzler kurmayı sağlayan yardımcı sınıf tabanlı CSS altyapısı',
    color: '#38bdf8',
  },
  {
    name: 'MySQL',
    mark: 'mysql',
    description: 'İşletme verilerinin güvenli ve ilişkisel biçimde saklandığı veritabanı sistemi',
    color: '#4aa3c7',
  },
  {
    name: 'REST API',
    mark: 'restapi',
    description:
      'Frontend ve backend sistemlerinin güvenli biçimde iletişim kurmasını sağlayan servis mimarisi',
    color: '#5eead4',
  },
  {
    name: 'Git',
    mark: 'git',
    description: 'Kod değişikliklerinin sürümlenmesini ve güvenle geri alınmasını sağlayan sistem',
    color: '#f1502f',
  },
  {
    name: 'Docker',
    mark: 'docker',
    description:
      'Uygulamaların farklı ortamlarda tutarlı biçimde çalışmasını sağlayan konteyner altyapısı',
    color: '#2496ed',
  },
  {
    name: 'Redis',
    mark: 'redis',
    description:
      'Önbellek ve kuyruk işlemleriyle uygulamanın tepki süresini kısaltan bellek içi veri deposu',
    color: '#ff6b5b',
  },
  {
    name: 'Vite',
    mark: 'vite',
    description: 'Arayüz kodunu hızlı derleyip optimize edilmiş çıktı üreten modern geliştirme aracı',
    color: '#a78bfa',
  },
  {
    name: 'Nginx',
    mark: 'nginx',
    description: 'İstekleri karşılayan, statik dosyaları hızlı sunan ve yükü dağıtan web sunucusu',
    color: '#00b04f',
  },
  {
    name: 'Cloudflare',
    mark: 'cloudflare',
    description: 'Güvenlik, önbellekleme ve dağıtım performansını iyileştiren ağ hizmeti',
    color: '#f6821f',
  },
  {
    name: 'HTML5',
    mark: 'html5',
    description:
      'Sayfa yapısını arama motorlarının doğru okuyabileceği anlamlı etiketlerle kuran standart',
    color: '#e34f26',
  },
  {
    name: 'CSS3',
    mark: 'css3',
    description: 'Tasarımın her ekran boyutunda tutarlı görünmesini sağlayan stil standardı',
    color: '#2f74c0',
  },
]

/** Marquee iki satır halinde akar. */
export const techRowOne = technologies.slice(0, 8)
export const techRowTwo = technologies.slice(8)

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Seo } from '@/components/common/Seo'
import { faqItems } from '@/constants/content'
import { services } from '@/constants/services'
import { site } from '@/constants/site'
import { scrollToSection } from '@/lib/scroll'
import { Hero } from '@/sections/Hero'
import { Trust } from '@/sections/Trust'
import { Services } from '@/sections/Services'
import { WhyUs } from '@/sections/WhyUs'
import { Proof } from '@/sections/Proof'
import { Process } from '@/sections/Process'
import { Technologies } from '@/sections/Technologies'
import { Industries } from '@/sections/Industries'
import { FAQ } from '@/sections/FAQ'
import { CTA } from '@/sections/CTA'
import { Contact } from '@/sections/Contact'

/** FAQPage ve Service şemaları içerikle aynı kaynaktan üretilir. */
const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  },
  ...services.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.description,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    areaServed: { '@type': 'Country', name: 'Türkiye' },
  })),
]

export default function HomePage() {
  const { hash } = useLocation()

  // Alt sayfadan "/#hizmetler" gibi bir bağlantıyla gelindiğinde ilgili
  // bölüme kaydır (React Router hash'i kendiliğinden işlemez).
  useEffect(() => {
    if (!hash) return
    const timer = window.setTimeout(() => scrollToSection(hash), 120)
    return () => window.clearTimeout(timer)
  }, [hash])

  return (
    <>
      <Seo
        title="Ülkü Yazılım | Kurumsal Web Sitesi ve Web Uygulaması Geliştirme"
        description="İşletmelere özel kurumsal web siteleri, ihtiyaca özel siteler ve web uygulamaları geliştiriyoruz. Hızlı, mobil uyumlu, güvenli, geliştirilebilir çözümler."
        path="/"
        jsonLd={homeJsonLd}
      />

      <Hero />
      <Trust />
      <Services />
      <WhyUs />
      <Proof />
      <Process />
      <Technologies />
      <Industries />
      <FAQ />
      <CTA />
      <Contact />
    </>
  )
}

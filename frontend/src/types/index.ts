import type { LucideIcon } from 'lucide-react'

/* ---------------------------------------------------------------------------
   İçerik tipleri — bugün statik constants dosyalarından besleniyor, ileride
   aynı şekiller Laravel API'sinden gelebilir.
--------------------------------------------------------------------------- */

export type NavItem = {
  label: string
  href: string
}

export type Service = {
  id: string
  title: string
  description: string
  features: string[]
  cta: string
  icon: LucideIcon
  accent: string
  /** İletişim formundaki hizmet seçeneğiyle eşleşen değer. */
  formValue: ServiceType
  /** Bento grid içinde kaç sütun kaplayacağı. */
  span: 'wide' | 'normal'
}

export type ProjectVisualKind =
  | 'corporate'
  | 'booking'
  | 'portal'
  | 'quotes'
  | 'multibranch'
  | 'membership'
  | 'ecommerce'

export type ProjectScenario = {
  id: string
  title: string
  type: string
  problem: string
  scenario: string
  summary: string
  features: string[]
  stack: string[]
  visual: ProjectVisualKind
  accent: string
}

export type ProcessStep = {
  id: string
  title: string
  description: string
  output: string
  icon: LucideIcon
}

export type TechMark =
  | 'laravel'
  | 'php'
  | 'react'
  | 'typescript'
  | 'javascript'
  | 'tailwind'
  | 'mysql'
  | 'restapi'
  | 'git'
  | 'docker'
  | 'redis'
  | 'vite'
  | 'nginx'
  | 'cloudflare'
  | 'html5'
  | 'css3'

export type Technology = {
  name: string
  mark: TechMark
  description: string
  color: string
}

export type ValueProp = {
  title: string
  description: string
  icon: LucideIcon
  accent: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type SelectOption = {
  value: string
  label: string
  hint?: string
}

/* ---------------------------------------------------------------------------
   Teklif talebi (API sözleşmesi)
--------------------------------------------------------------------------- */

export type ServiceType =
  | 'kurumsal-web-sitesi'
  | 'ozel-web-sitesi'
  | 'web-uygulamasi'
  | 'site-yenileme'
  | 'yonetim-paneli'
  | 'api-entegrasyon'
  | 'bakim-destek'
  | 'seo-danismanligi'
  | 'kurumsal-kimlik'
  | 'emin-degilim'

export type BudgetRange = 'baslangic' | 'orta' | 'genis' | 'birlikte'

export type ContactMethod = 'telefon' | 'whatsapp' | 'eposta' | 'online-gorusme'

export type QuoteRequestPayload = {
  full_name: string
  company_name?: string
  email: string
  phone: string
  service_type: ServiceType
  budget_range: BudgetRange
  preferred_contact_method: ContactMethod
  project_description: string
  /** Bot tuzağı — insan kullanıcıda daima boş kalır. */
  website?: string
}

/** Laravel tarafındaki tutarlı API zarfı. */
export type ApiSuccess<TData> = {
  success: true
  message: string
  data: TData
}

export type ApiFailure = {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export type QuoteRequestResult = { request_id: number }

/** İstek katmanının dışarı verdiği normalize edilmiş hata. */
export type ApiErrorShape = {
  message: string
  fieldErrors: Record<string, string>
  /** Oran sınırına takıldıysak kaç saniye sonra tekrar denenebilir. */
  retryAfter?: number
}

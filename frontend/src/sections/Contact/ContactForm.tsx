import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react'
import { budgetOptions, contactMethodOptions, serviceOptions } from '@/constants/form'
import { quoteRequestSchema, type QuoteRequestForm } from '@/lib/quoteRequestSchema'
import { submitQuoteRequest } from '@/services/quoteRequests'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { inputClass } from '@/lib/formStyles'
import { SelectField } from '@/components/ui/Select'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { cn } from '@/lib/cn'
import type { ServiceType } from '@/types'

type Step = 0 | 1 | 2

const STEP_LABELS = ['Projeniz', 'İletişim bilgileri', 'Tamamlandı']

/** Hizmet kartlarından gelen ön seçim olayı. */
const SELECT_SERVICE_EVENT = 'uy:select-service'

export function ContactForm() {
  const { reduced } = useMotionProfile()
  const [step, setStep] = useState<Step>(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Aynı talebin iki kez gönderilmesini engelleyen kilit.

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteRequestForm>({
    resolver: zodResolver(quoteRequestSchema),
    mode: 'onBlur',
    defaultValues: {
      project_description: '',
      full_name: '',
      company_name: '',
      email: '',
      phone: '',
      website: '',
    },
  })

  const selectedService = useWatch({ control, name: 'service_type' })
  const description = useWatch({ control, name: 'project_description' }) ?? ''

  // Hizmet kartlarındaki CTA'lar ilgili hizmeti önceden işaretler.
  useEffect(() => {
    const onSelectService = (event: Event) => {
      const detail = (event as CustomEvent<ServiceType>).detail
      if (!detail) return
      setValue('service_type', detail, { shouldValidate: false })
    }

    window.addEventListener(SELECT_SERVICE_EVENT, onSelectService)
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelectService)
  }, [setValue])

  // Bileşen kaldırılırsa uçuşan isteği iptal et.

  const activeHint = serviceOptions.find((option) => option.value === selectedService)?.hint

  const goToStepTwo = async () => {
    const valid = await trigger('project_description')
    if (valid) {
      setFormError(null)
      setStep(1)
    }
  }

  const submitValues = useCallback(async (values: QuoteRequestForm) => {
    setFormError(null)

    const controller = new AbortController()
    const result = await submitQuoteRequest(
      {
        full_name: values.full_name,
        company_name: values.company_name || undefined,
        email: values.email,
        phone: values.phone,
        service_type: values.service_type,
        budget_range: values.budget_range,
        preferred_contact_method: values.preferred_contact_method,
        project_description: values.project_description,
        website: values.website || undefined,
      },
      controller.signal,
    )

    if (result.ok) {
      setSuccessMessage(result.message)
      setStep(2)
      return
    }

    // Hata durumunda kilidi aç — kullanıcı düzeltip tekrar deneyebilsin.

    const { message, fieldErrors } = result.error
    const entries = Object.entries(fieldErrors)

    if (entries.length > 0) {
      for (const [field, text] of entries) {
        if (field in values) {
          setError(field as keyof QuoteRequestForm, { type: 'server', message: text })
        }
      }
      // Hata proje açıklamasındaysa kullanıcıyı ilk adıma geri al.
      if ('project_description' in fieldErrors) setStep(0)
    }

    setFormError(message)
  }, [setError])

  const onSubmit = handleSubmit(submitValues)

  const progress = step === 0 ? 33 : step === 1 ? 66 : 100

  return (
    <div className="premium-form-panel card-surface relative overflow-hidden p-6 sm:p-8">
      {/* İlerleme göstergesi */}
      <div aria-hidden={step === 2}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-fg font-medium">
            {step === 2 ? 'Teşekkürler' : `Adım ${step + 1} / 2`}
          </span>
          <span className="text-fg-dim">{STEP_LABELS[step]}</span>
        </div>
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#2563eb,#3d9bff,#22d3ee)]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduced ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Durum duyuruları ekran okuyucular için */}
      <p role="status" aria-live="polite" className="sr-only">
        {successMessage ?? formError ?? ''}
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-7">
        {/* Bot tuzağı. `inert` alanı hem klavye odağından hem de erişilebilirlik
            ağacından tamamen çıkarır; ekran okuyucu kullanıcısı bu alanı hiç
            görmez, botlar ise doldurmaya devam eder. */}
        <div aria-hidden="true" inert className="absolute h-0 w-0 overflow-hidden opacity-0">
          <label htmlFor="website">Bu alanı boş bırakın</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {/* ---------------------------------------------------------------
              Adım 1 — Proje açıklaması
          --------------------------------------------------------------- */}
          {step === 0 && (
            <motion.div
              key="step-1"
              initial={reduced ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Field
                id="project_description"
                label="Projenizi birkaç cümleyle anlatın"
                error={errors.project_description?.message}
                hint="Ne yapmak istediğinizi, hangi sorunu çözmek istediğinizi yazmanız yeterli. Teknik ayrıntı gerekmiyor."
              >
                <textarea
                  id="project_description"
                  rows={6}
                  autoComplete="off"
                  aria-invalid={Boolean(errors.project_description)}
                  aria-describedby={
                    errors.project_description
                      ? 'project_description-error'
                      : 'project_description-hint'
                  }
                  placeholder="Örneğin: Kliniğimiz için hastaların online randevu alabileceği, personel takvimini yönetebildiğimiz bir sistem istiyoruz."
                  className={cn(inputClass(Boolean(errors.project_description)), 'resize-y')}
                  {...register('project_description')}
                />
              </Field>

              <div className="mt-2 flex justify-end">
                <span className="text-fg-dim text-[0.7rem] tabular-nums">
                  {description.trim().length} / 5000
                </span>
              </div>

              <Button
                type="button"
                size="lg"
                className="mt-5 w-full"
                magnetic={false}
                onClick={goToStepTwo}
              >
                Projemi Biraz Daha Anlatayım
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </motion.div>
          )}

          {/* ---------------------------------------------------------------
              Adım 2 — İletişim ve kapsam bilgileri
          --------------------------------------------------------------- */}
          {step === 1 && (
            <motion.div
              key="step-2"
              initial={reduced ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="full_name" label="Ad Soyad" error={errors.full_name?.message}>
                  <input
                    id="full_name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.full_name)}
                    aria-describedby={errors.full_name ? 'full_name-error' : undefined}
                    className={inputClass(Boolean(errors.full_name))}
                    {...register('full_name')}
                  />
                </Field>

                <Field
                  id="company_name"
                  label="Firma Adı"
                  optional
                  error={errors.company_name?.message}
                >
                  <input
                    id="company_name"
                    type="text"
                    autoComplete="organization"
                    aria-invalid={Boolean(errors.company_name)}
                    aria-describedby={errors.company_name ? 'company_name-error' : undefined}
                    className={inputClass(Boolean(errors.company_name))}
                    {...register('company_name')}
                  />
                </Field>

                <Field id="email" label="E-posta" error={errors.email?.message}>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={inputClass(Boolean(errors.email))}
                    {...register('email')}
                  />
                </Field>

                <Field id="phone" label="Telefon" error={errors.phone?.message}>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+90 5.. ... .. .."
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={inputClass(Boolean(errors.phone))}
                    {...register('phone')}
                  />
                </Field>
              </div>

              <Field
                id="service_type"
                label="İhtiyaç duyduğunuz hizmet"
                error={errors.service_type?.message}
                hint={activeHint}
              >
                <Controller
                  control={control}
                  name="service_type"
                  render={({ field }) => (
                    <SelectField
                      id="service_type"
                      value={field.value}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      options={serviceOptions}
                      placeholder="Bir hizmet seçin"
                      invalid={Boolean(errors.service_type)}
                      describedBy={errors.service_type ? 'service_type-error' : 'service_type-hint'}
                    />
                  )}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="budget_range"
                  label="Tahmini bütçe aralığı"
                  error={errors.budget_range?.message}
                >
                  <Controller
                    control={control}
                    name="budget_range"
                    render={({ field }) => (
                      <SelectField
                        id="budget_range"
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        options={budgetOptions}
                        placeholder="Bir aralık seçin"
                        invalid={Boolean(errors.budget_range)}
                        describedBy={errors.budget_range ? 'budget_range-error' : undefined}
                      />
                    )}
                  />
                </Field>

                <Field
                  id="preferred_contact_method"
                  label="Tercih ettiğiniz iletişim yöntemi"
                  error={errors.preferred_contact_method?.message}
                >
                  <Controller
                    control={control}
                    name="preferred_contact_method"
                    render={({ field }) => (
                      <SelectField
                        id="preferred_contact_method"
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        options={contactMethodOptions}
                        placeholder="Nasıl ulaşalım?"
                        invalid={Boolean(errors.preferred_contact_method)}
                        describedBy={
                          errors.preferred_contact_method
                            ? 'preferred_contact_method-error'
                            : undefined
                        }
                      />
                    )}
                  />
                </Field>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-500/30 bg-rose-500/8 px-4 py-3 text-sm text-rose-200"
                >
                  {formError}
                </p>
              )}

              <div className="flex flex-col gap-3 pt-1 sm:flex-row-reverse">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  magnetic={false}
                  className="w-full sm:flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Gönderiliyor…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" aria-hidden="true" />
                      Projemi Anlat
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  magnetic={false}
                  disabled={isSubmitting}
                  onClick={() => setStep(0)}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Önceki Adım
                </Button>
              </div>

              <p className="text-fg-dim text-xs leading-relaxed">
                Formu göndererek iletişim bilgilerinizin yalnızca talebinizi değerlendirmek amacıyla
                işlenmesini kabul etmiş olursunuz. Ayrıntılar için{' '}
                <a
                  href="/kvkk-aydinlatma-metni"
                  className="text-brand-400 underline-offset-4 hover:underline"
                >
                  KVKK aydınlatma metnimize
                </a>{' '}
                bakabilirsiniz.
              </p>
            </motion.div>
          )}

          {/* ---------------------------------------------------------------
              Başarı ekranı
          --------------------------------------------------------------- */}
          {step === 2 && (
            <motion.div
              key="step-success"
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center py-8 text-center"
            >
              <motion.span
                initial={reduced ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                className="grid size-16 place-items-center rounded-full bg-emerald-400/12 text-emerald-400"
              >
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </motion.span>

              <h3 className="font-display text-fg mt-6 text-xl font-semibold">
                Mesajınız bize ulaştı.
              </h3>
              <p className="text-fg-muted mt-3 max-w-sm text-sm leading-relaxed">
                Projenizi inceleyip sizinle iletişime geçeceğiz. Genellikle bir iş günü içinde dönüş
                yapıyoruz.
              </p>

              <Button
                variant="secondary"
                size="md"
                magnetic={false}
                className="mt-7"
                onClick={() => {
                  // Yeni bir talep için formu sıfırlamak yerine kullanıcıyı
                  // bilinçli bir adımla başa döndürüyoruz.
                  setSuccessMessage(null)
                  setStep(0)
                }}
              >
                Yeni bir talep oluştur
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}

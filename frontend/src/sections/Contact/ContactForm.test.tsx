import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ContactForm } from './ContactForm'
import * as quoteRequests from '@/services/quoteRequests'

function renderForm() {
  return render(
    <MemoryRouter>
      <ContactForm />
    </MemoryRouter>,
  )
}

/** Adım 1'i geçerli veriyle doldurup adım 2'ye ilerler. */
async function goToStepTwo(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText(/Projenizi birkaç cümleyle anlatın/i),
    'Hastalarımızın internet üzerinden randevu alabileceği bir sistem istiyoruz.',
  )
  await user.click(screen.getByRole('button', { name: /Projemi Biraz Daha Anlatayım/i }))
  await screen.findByLabelText('Ad Soyad')
}

/** Radix Select'i klavyeyle açıp seçenek işaretler (jsdom'da güvenilir yol). */
async function pickOption(
  user: ReturnType<typeof userEvent.setup>,
  label: RegExp | string,
  optionName: RegExp | string,
) {
  const trigger = screen.getByLabelText(label)
  trigger.focus()
  await user.keyboard('{ArrowDown}')
  const option = await screen.findByRole('option', { name: optionName })
  await user.click(option)
}

/** Adım 2'nin tüm zorunlu alanlarını doldurur. */
async function fillStepTwo(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Ad Soyad'), 'Ayşe Yılmaz')
  await user.type(screen.getByLabelText('E-posta'), 'ayse@ornek-klinik.test')
  await user.type(screen.getByLabelText('Telefon'), '+90 555 000 00 00')

  await pickOption(user, /İhtiyaç duyduğunuz hizmet/i, 'Web uygulaması')
  await pickOption(user, /Tahmini bütçe aralığı/i, 'Orta kapsamlı proje')
  await pickOption(user, /Tercih ettiğiniz iletişim yöntemi/i, 'E-posta')
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('ilk adımda kısa açıklamayla ilerlemeyi engeller', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: /Projemi Biraz Daha Anlatayım/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Projenizi biraz daha anlatın (en az 20 karakter).',
    )
    // Hâlâ birinci adımdayız
    expect(screen.queryByLabelText('Ad Soyad')).not.toBeInTheDocument()
  })

  it('geçerli açıklamayla ikinci adıma geçer', async () => {
    const user = userEvent.setup()
    renderForm()

    await goToStepTwo(user)

    expect(screen.getByLabelText('Ad Soyad')).toBeInTheDocument()
    expect(screen.getByLabelText('E-posta')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Projemi Anlat/i })).toBeInTheDocument()
  })

  it('önceki adıma dönüldüğünde yazılan açıklama korunur', async () => {
    const user = userEvent.setup()
    renderForm()

    await goToStepTwo(user)
    await user.click(screen.getByRole('button', { name: /Önceki Adım/i }))

    const textarea = await screen.findByLabelText(/Projenizi birkaç cümleyle anlatın/i)
    expect(textarea).toHaveValue(
      'Hastalarımızın internet üzerinden randevu alabileceği bir sistem istiyoruz.',
    )
  })

  it('eksik alanlarla gönderimde API çağrısı yapılmaz', async () => {
    const user = userEvent.setup()
    const submitSpy = vi.spyOn(quoteRequests, 'submitQuoteRequest')
    renderForm()

    await goToStepTwo(user)
    await user.click(screen.getByRole('button', { name: /Projemi Anlat/i }))

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
    expect(submitSpy).not.toHaveBeenCalled()
  })

  it('hizmet kartından gelen olay hizmet seçimini önceden doldurur', async () => {
    const user = userEvent.setup()
    renderForm()

    await goToStepTwo(user)

    window.dispatchEvent(new CustomEvent('uy:select-service', { detail: 'web-uygulamasi' }))

    // Seçim tetikleyicide görünür hâle gelir.
    expect(await screen.findByText('Web uygulaması')).toBeInTheDocument()
  })

  it('başarılı gönderimde başarı ekranını gösterir ve tekrar göndermeyi engeller', async () => {
    const user = userEvent.setup()
    const submitSpy = vi.spyOn(quoteRequests, 'submitQuoteRequest').mockResolvedValue({
      ok: true,
      message: 'Mesajınız bize ulaştı. Projenizi inceleyip sizinle iletişime geçeceğiz.',
      requestId: 7,
    })

    renderForm()
    await goToStepTwo(user)
    await fillStepTwo(user)

    await user.click(screen.getByRole('button', { name: /Projemi Anlat/i }))

    expect(await screen.findByText('Mesajınız bize ulaştı.')).toBeInTheDocument()
    expect(submitSpy).toHaveBeenCalledTimes(1)
    // Gönder butonu artık ekranda değil → aynı talep ikinci kez gidemez.
    expect(screen.queryByRole('button', { name: /Projemi Anlat/i })).not.toBeInTheDocument()
  })

  it('sunucudan gelen alan hatasını ilgili alanda gösterir', async () => {
    const user = userEvent.setup()
    vi.spyOn(quoteRequests, 'submitQuoteRequest').mockResolvedValue({
      ok: false,
      error: {
        message: 'Formdaki bazı alanları kontrol edin.',
        fieldErrors: { email: 'Bu e-posta adresi kullanılamıyor.' },
      },
    })

    renderForm()
    await goToStepTwo(user)
    await fillStepTwo(user)

    await user.click(screen.getByRole('button', { name: /Projemi Anlat/i }))

    expect(await screen.findByText('Bu e-posta adresi kullanılamıyor.')).toBeInTheDocument()
    // Hata sonrası kullanıcı düzeltip tekrar deneyebilmeli.
    expect(screen.getByRole('button', { name: /Projemi Anlat/i })).toBeEnabled()
    // Girilen veriler kaybolmamalı.
    expect(screen.getByLabelText('Ad Soyad')).toHaveValue('Ayşe Yılmaz')
  })
})

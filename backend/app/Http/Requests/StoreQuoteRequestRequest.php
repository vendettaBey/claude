<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\BudgetRange;
use App\Enums\ContactMethod;
use App\Enums\ServiceType;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rules\Enum;

/**
 * Teklif formunun doğrulaması.
 * Kurallar frontend'deki Zod şemasıyla aynı hizada tutulur.
 */
class StoreQuoteRequestRequest extends FormRequest
{
    /** Form herkese açıktır; yetki kontrolü yoktur. */
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'min:2', 'max:120'],
            'company_name' => ['nullable', 'string', 'max:160'],
            'email' => ['required', 'string', 'email:rfc', 'max:180'],
            'phone' => ['required', 'string', 'max:32', 'regex:/^[+()\d\s.\-]{10,20}$/'],

            'service_type' => ['required', new Enum(ServiceType::class)],
            'budget_range' => ['required', new Enum(BudgetRange::class)],
            'preferred_contact_method' => ['required', new Enum(ContactMethod::class)],

            'project_description' => ['required', 'string', 'min:20', 'max:5000'],

            // Bot tuzağı: gerçek kullanıcıda daima boş gelir.
            'website' => ['nullable', 'prohibited'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'full_name.required' => 'Adınızı ve soyadınızı yazın.',
            'full_name.min' => 'Adınızı ve soyadınızı yazın.',
            'email.required' => 'E-posta adresinizi girin.',
            'email.email' => 'Geçerli bir e-posta adresi girin.',
            'phone.required' => 'Telefon numaranızı girin.',
            'phone.regex' => 'Geçerli bir telefon numarası girin.',
            'service_type.required' => 'Bir hizmet seçin.',
            'budget_range.required' => 'Bir bütçe aralığı seçin.',
            'preferred_contact_method.required' => 'Tercih ettiğiniz iletişim yöntemini seçin.',
            'project_description.required' => 'Projenizi birkaç cümleyle anlatın.',
            'project_description.min' => 'Projenizi biraz daha anlatın (en az 20 karakter).',
            'website.prohibited' => 'İstek doğrulanamadı.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'full_name' => 'ad soyad',
            'company_name' => 'firma adı',
            'email' => 'e-posta',
            'phone' => 'telefon',
            'service_type' => 'hizmet',
            'budget_range' => 'bütçe aralığı',
            'preferred_contact_method' => 'iletişim yöntemi',
            'project_description' => 'proje açıklaması',
        ];
    }

    /** Boşlukları baştan temizleyip doğrulamaya tutarlı veri veriyoruz. */
    protected function prepareForValidation(): void
    {
        $this->merge(array_filter([
            'full_name' => $this->trimmed('full_name'),
            'company_name' => $this->trimmed('company_name'),
            'email' => $this->trimmed('email') !== null
                ? mb_strtolower((string) $this->trimmed('email'))
                : null,
            'phone' => $this->trimmed('phone'),
            'project_description' => $this->trimmed('project_description'),
        ], static fn ($value): bool => $value !== null));
    }

    private function trimmed(string $key): ?string
    {
        $value = $this->input($key);

        return is_string($value) ? trim($value) : null;
    }

    /**
     * Doğrulama hataları da başarı yanıtıyla aynı zarfı kullanır;
     * frontend tek bir şekil bekler.
     */
    protected function failedValidation(Validator $validator): never
    {
        throw new HttpResponseException(new JsonResponse([
            'success' => false,
            'message' => 'Formdaki bazı alanları kontrol edin.',
            'errors' => $validator->errors()->toArray(),
        ], 422));
    }
}

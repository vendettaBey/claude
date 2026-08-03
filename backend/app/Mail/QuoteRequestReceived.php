<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\QuoteRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Ekibe gönderilen "yeni teklif talebi" bildirimi.
 *
 * Kuyruk yapılandırıldığında (QUEUE_CONNECTION=redis/database) gönderim
 * arka plana alınır; senkron sürücüde doğrudan gönderilir.
 */
class QuoteRequestReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly QuoteRequest $quoteRequest) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Yeni teklif talebi: '.$this->quoteRequest->service_type->label(),
            // Yanıtla dendiğinde doğrudan talep sahibine gitsin.
            replyTo: [$this->quoteRequest->email],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.quote-request-received',
            with: [
                'request' => $this->quoteRequest,
            ],
        );
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\QuoteRequestStatus;
use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class QuoteRequestController extends Controller
{
    public function index(Request $request): View
    {
        $validated = $request->validate([
            'status' => ['nullable', Rule::enum(QuoteRequestStatus::class)],
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        $search = trim((string) ($validated['q'] ?? ''));
        $status = isset($validated['status'])
            ? QuoteRequestStatus::from($validated['status'])
            : null;

        $requests = QuoteRequest::query()
            ->when($status, fn (Builder $query) => $query->where('status', $status->value))
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $nested) use ($search): void {
                    $nested
                        ->where('full_name', 'like', "%{$search}%")
                        ->orWhere('company_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $counts = QuoteRequest::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        return view('admin.requests.index', [
            'requests' => $requests,
            'statuses' => QuoteRequestStatus::cases(),
            'activeStatus' => $status,
            'search' => $search,
            'counts' => $counts,
            'total' => (int) $counts->sum(),
        ]);
    }

    public function update(Request $request, QuoteRequest $quoteRequest): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(QuoteRequestStatus::class)],
        ]);

        $quoteRequest->update(['status' => $validated['status']]);

        return back()->with('success', "#{$quoteRequest->id} numaralı talep güncellendi.");
    }
}

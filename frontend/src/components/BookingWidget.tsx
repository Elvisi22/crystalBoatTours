import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useMemo, useState } from 'react';
import { api, type CreateOrderResponse, type Tour } from '../api';
import { PAYPAL_CLIENT_ID, PAYPAL_CURRENCY } from '../config';
import { CheckIcon } from './icons';

const TIMES = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
const today = new Date().toISOString().slice(0, 10);

type Step = 'form' | 'pay' | 'done';

export default function BookingWidget({ tour }: { tour: Tour }) {
  const hasOptions = !!tour.priceOptions?.length;
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState({
    date: '',
    time: '10:00',
    quantity: 1,
    optionLabel: tour.priceOptions?.[0]?.label ?? '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [order, setOrder] = useState<CreateOrderResponse | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const unitPrice = useMemo(() => {
    if (hasOptions) {
      return tour.priceOptions!.find((o) => o.label === form.optionLabel)?.price ?? tour.price;
    }
    return tour.price;
  }, [hasOptions, tour, form.optionLabel]);

  const total = useMemo(() => unitPrice * form.quantity, [unitPrice, form.quantity]);
  const deposit = useMemo(() => Math.round(total * 0.2 * 100) / 100, [total]);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: k === 'quantity' ? Number(e.target.value) : e.target.value }));

  const startPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.createBookingOrder({
        tourSlug: tour.slug,
        date: form.date,
        time: form.time,
        quantity: form.quantity,
        optionLabel: hasOptions ? form.optionLabel : undefined,
        name: form.name,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
      });
      setOrder(res);
      setStep('pay');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start booking.');
    } finally {
      setBusy(false);
    }
  };

  const finish = async () => {
    if (!order) return;
    setError('');
    setBusy(true);
    try {
      await api.captureBooking(order.bookingId, order.orderId);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed.');
    } finally {
      setBusy(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="rounded-3xl border border-teal-sea/30 bg-teal-sea/5 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-sea text-white">
          <CheckIcon className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-deep">Booking confirmed!</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
          Your {tour.name} on <strong>{form.date}</strong> at <strong>{form.time}</strong> is reserved.
          We received your {order?.depositPercent ?? 20}% deposit and sent the details to our team.
          The remaining balance is paid on the day.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8">
      {/* Price summary */}
      <div className="mb-6 rounded-2xl bg-ocean-50 p-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            {tour.name}
            {hasOptions ? ` · ${form.optionLabel}` : ''} × {form.quantity}
          </span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between font-display text-lg font-bold text-deep">
          <span>Deposit due now (20%)</span>
          <span className="text-ocean-700">€{deposit.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Remaining €{(total - deposit).toFixed(2)} paid on arrival.
        </p>
        {tour.pricingNote && <p className="mt-1 text-xs text-slate-500">{tour.pricingNote}</p>}
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      {step === 'form' && (
        <form onSubmit={startPayment} className="space-y-4">
          {hasOptions && (
            <Field label="Option">
              <select value={form.optionLabel} onChange={set('optionLabel')} className={inputCls}>
                {tour.priceOptions!.map((o) => (
                  <option key={o.label} value={o.label}>
                    {o.label} — €{o.price}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date">
              <input type="date" required min={today} value={form.date} onChange={set('date')} className={inputCls} />
            </Field>
            <Field label="Time">
              <select value={form.time} onChange={set('time')} className={inputCls}>
                {TIMES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label={tour.quantityLabel}>
            <input type="number" min={1} max={20} required value={form.quantity} onChange={set('quantity')} className={inputCls} />
          </Field>
          <Field label="Full name">
            <input type="text" required value={form.name} onChange={set('name')} className={inputCls} placeholder="Jane Doe" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input type="email" required value={form.email} onChange={set('email')} className={inputCls} placeholder="you@email.com" />
            </Field>
            <Field label="Phone">
              <input type="tel" required value={form.phone} onChange={set('phone')} className={inputCls} placeholder="+355 …" />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <textarea rows={2} value={form.notes} onChange={set('notes')} className={inputCls} placeholder="Anything we should know?" />
          </Field>
          <button disabled={busy} className="btn-primary w-full text-base">
            {busy ? 'Please wait…' : `Continue to deposit — €${deposit.toFixed(2)}`}
          </button>
          <p className="text-center text-xs text-slate-400">Secure payment · No account needed</p>
        </form>
      )}

      {step === 'pay' && order && (
        <div className="space-y-4">
          <button onClick={() => setStep('form')} className="text-sm text-slate-500 hover:text-ocean-600">
            ← Edit details
          </button>
          {order.mock || !PAYPAL_CLIENT_ID ? (
            <>
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Demo mode — no PayPal keys configured. Click below to simulate paying the deposit.
              </p>
              <button onClick={finish} disabled={busy} className="btn-accent w-full text-base">
                {busy ? 'Processing…' : `Pay deposit €${order.depositAmount.toFixed(2)} (demo)`}
              </button>
            </>
          ) : (
            <PayPalScriptProvider
              options={{ clientId: PAYPAL_CLIENT_ID, currency: order.currency || PAYPAL_CURRENCY, intent: 'capture' }}
            >
              <PayPalButtons
                style={{ layout: 'vertical', shape: 'pill', color: 'blue' }}
                createOrder={() => Promise.resolve(order.orderId)}
                onApprove={async () => { await finish(); }}
                onError={() => setError('PayPal error — please try again.')}
              />
            </PayPalScriptProvider>
          )}
        </div>
      )}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-100';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

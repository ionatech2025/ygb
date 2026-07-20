import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { isValidUgandaPhoneLocal } from '../../../../core/utils/phone-utils';
import { UGANDA_PHONE_ERROR } from '../../../../core/form-validation';
import { FormField, formControlClassName } from '../components/forms';
import { ThemeToggle } from '../components/ThemeToggle';

const FEATURES = [
  { title: 'Works Anywhere', detail: 'Collect data in the field even when connectivity is limited.' },
  { title: 'Safe & Secure', detail: 'Accounts and submissions are protected end-to-end.' },
  { title: 'Admin Directory', detail: 'Register and manage field collector accounts in one place.' },
  { title: 'Easy Reporting', detail: 'Track daily submissions and sync progress instantly.' },
] as const;

export function PortalLogin() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim() || !password) {
      setError('Please enter both your phone number and password.');
      return;
    }

    if (!isValidUgandaPhoneLocal(phone)) {
      setError(UGANDA_PHONE_ERROR);
      return;
    }

    setLoading(true);
    try {
      await login(phone, password);
      const user = useAuthStore.getState().user;
      navigate(user?.role === 'ADMIN' ? '/admin/dashboard' : '/collector/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh bg-surface-muted">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      {/* Mobile-first: sign-in first, hero below; desktop: split layout */}
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col lg:flex-row">
        <section className="order-2 flex flex-1 flex-col justify-between bg-gradient-to-br from-nac-blue via-nac-blue-dark to-slate-900 px-5 py-10 text-white lg:order-1 lg:px-12 lg:py-14">
          <div className="relative z-10 flex items-center gap-3">
            <span className="rounded-xl bg-nac-orange px-3 py-1.5 text-lg font-black tracking-wider shadow-md">
              NAC
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-200">Network for Active Citizens</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-200">Survey System</p>
            </div>
          </div>

          <div className="relative z-10 my-8 max-w-xl space-y-5 lg:my-auto">
            <span className="inline-block rounded-full border border-orange-400/30 bg-orange-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-200">
              Official Portal
            </span>
            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              Collecting insights to drive active community action.
            </h1>
            <p className="text-sm leading-relaxed text-blue-100">
              Welcome to the YGB Survey Tool. Collect feedback safely, manage field teams, and track progress across target communities.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-nac-orange" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="text-xs text-blue-100/90">{feature.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 text-xs text-blue-300">
            &copy; {new Date().getFullYear()} Network for Active Citizens
          </p>
        </section>

        <section className="order-1 flex flex-1 items-center justify-center px-4 py-8 lg:order-2 lg:px-10">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-md sm:p-8">
            <div className="mb-6 space-y-1">
              <h2 className="text-xl font-bold text-text sm:text-2xl">Sign in</h2>
              <p className="text-sm text-text-muted">Use your phone number and password to open your portal.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Phone number" htmlFor="phone" required>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0770000000"
                  className={formControlClassName}
                  disabled={loading}
                />
              </FormField>

              <FormField label="Password" htmlFor="password" required>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={formControlClassName}
                  disabled={loading}
                />
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-nac-orange text-sm font-bold text-white shadow-sm transition hover:bg-nac-orange-hover active:scale-[0.98] disabled:bg-slate-300"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {loading ? 'Signing in…' : 'Open My Portal'}
              </button>
            </form>

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Backend test accounts
              </p>
              <div className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-2.5 text-center">
                  <p className="font-bold text-nac-blue">Administrator</p>
                  <p className="text-text-muted">0770000000</p>
                  <p className="text-text-muted">password</p>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-2.5 text-center">
                  <p className="font-bold text-orange-900">Data Collector</p>
                  <p className="text-text-muted">0771111111</p>
                  <p className="text-text-muted">password</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

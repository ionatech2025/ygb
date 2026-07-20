import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Loader2, ShieldCheck, Smartphone, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { isValidUgandaPhoneLocal } from '../../../../core/utils/phone-utils';
import { UGANDA_PHONE_ERROR } from '../../../../core/form-validation';
import { FormField, formControlClassName } from '../components/forms';
import { ThemeToggle } from '../components/ThemeToggle';

const FEATURES: { icon: LucideIcon; title: string; detail: string }[] = [
  {
    icon: Smartphone,
    title: 'Works Anywhere',
    detail: 'Collect data in the field even when connectivity is limited.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Secure',
    detail: 'Accounts and submissions are protected end-to-end.',
  },
  {
    icon: Users,
    title: 'Admin Directory',
    detail: 'Register and manage field collector accounts in one place.',
  },
  {
    icon: BarChart3,
    title: 'Easy Reporting',
    detail: 'Track daily submissions and sync progress instantly.',
  },
];

const TEST_ACCOUNTS = [
  { role: 'Administrator', phone: '0770000000', accent: 'text-brand' },
  { role: 'Data Collector', phone: '0771111111', accent: 'text-nac-orange' },
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
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl dark:bg-brand/5" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-nac-orange/10 blur-3xl dark:bg-nac-orange/5" />
      </div>

      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col lg:flex-row">
        <section className="relative order-2 flex flex-1 flex-col justify-between overflow-hidden bg-linear-to-br from-nac-blue via-nac-blue-dark to-slate-950 px-5 py-10 text-white lg:order-1 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

          <div className="relative z-10 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-nac-orange text-sm font-black tracking-wider shadow-lg shadow-nac-orange/25">
              YGB
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-100">Youth Go Budget App</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-200/90">Survey Platform</p>
            </div>
          </div>

          <div className="relative z-10 my-8 max-w-xl space-y-6 lg:my-auto">
            <span className="inline-flex items-center rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-100 backdrop-blur-sm">
              Official Portal
            </span>
            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              Collecting insights to drive active community action.
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-blue-100/90">
              Welcome to the YGB Survey Tool. Collect feedback safely, manage field teams, and track progress across target communities.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, detail }) => (
                <li
                  key={title}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nac-orange/20 text-nac-orange">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-blue-100/80">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 text-xs text-blue-200/70">
            &copy; {new Date().getFullYear()} Youth Go Budget App
          </p>
        </section>

        <section className="order-1 flex flex-1 items-center justify-center px-4 py-8 lg:order-2 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center gap-2.5 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-nac-orange text-xs font-black text-white">
                YGB
              </span>
              <div>
                <p className="text-sm font-bold text-text">Youth Go Budget App</p>
                <p className="text-[11px] text-text-muted">Sign in to continue</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-md ring-1 ring-black/3 sm:p-8 dark:ring-white/4">
              <div className="mb-6 space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-text sm:text-2xl">Sign in</h2>
                <p className="text-sm text-text-muted">Use your phone number and password to open your portal.</p>
              </div>

              {error && (
                <div
                  className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
                  role="alert"
                >
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
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-nac-orange text-sm font-bold text-white shadow-sm shadow-nac-orange/20 transition hover:bg-nac-orange-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-muted disabled:shadow-none"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {loading ? 'Signing in…' : 'Open My Portal'}
                </button>
              </form>

              <div className="mt-6 border-t border-border pt-5">
                <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Backend test accounts
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {TEST_ACCOUNTS.map(({ role, phone: testPhone, accent }) => (
                    <div
                      key={role}
                      className="rounded-xl border border-border bg-surface-muted/70 px-3 py-2.5 text-center"
                    >
                      <p className={`text-xs font-bold ${accent}`}>{role}</p>
                      <p className="mt-1 font-mono text-[11px] text-text">{testPhone}</p>
                      <p className="font-mono text-[11px] text-text-muted">password</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

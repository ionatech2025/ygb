import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Loader2, ShieldCheck, Smartphone, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { loginPortalClasses } from '../../../../core/domain/admin-dashboard.theme';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { isValidUgandaPhoneLocal } from '../../../../core/utils/phone-utils';
import { UGANDA_PHONE_ERROR } from '../../../../core/form-validation';
import { usePageMeta } from '../../../../core/hooks/usePageMeta';
import { PAGE_META } from '../../../../core/seo/site-meta';
import { FormField, formControlClassName, PasswordInput } from '../components/forms';
import { PwaInstallBanner } from '../components/PwaInstallBanner';
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
  const formSectionRef = useRef<HTMLElement>(null);

  usePageMeta(PAGE_META.login);

  const scrollToSignIn = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  const handleSelectTestAccount = (testPhone: string) => {
    setPhone(testPhone);
    setError('');
  };

  return (
    <div className={loginPortalClasses.shell}>
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={loginPortalClasses.ambientGlowLeft} />
        <div className={loginPortalClasses.ambientGlowRight} />
        <div className={loginPortalClasses.ambientGlowCenter} />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />
      </div>

      <div className="absolute right-4 top-4 z-20 flex items-center gap-3">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col lg:min-h-dvh lg:flex-row">
        {/* Brand Information Panel */}
        <section className={loginPortalClasses.brandPanel} aria-label="About the Youth Go Budget App">
          <span className={loginPortalClasses.brandAccent} aria-hidden="true" />

          <div className="relative z-10 flex items-center justify-between gap-3 pt-6 lg:pt-0">
            <div className="flex min-w-0 items-center gap-3">
              <span className={loginPortalClasses.brandMonogram} aria-hidden="true">
                YGB
              </span>
              <div className="min-w-0">
                <p className={loginPortalClasses.brandEyebrow}>Staff portal</p>
                <p className={loginPortalClasses.brandSubtitle}>Youth Go Budget App</p>
              </div>
            </div>
            <button type="button" onClick={scrollToSignIn} className={loginPortalClasses.mobileSignInButton}>
              Sign in
            </button>
          </div>

          <div className="relative z-10 my-8 max-w-xl space-y-6 lg:my-auto">
            <div className="flex items-center gap-2">
              <span className={loginPortalClasses.officialBadge}>
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                Official portal
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Offline Ready
              </span>
            </div>

            <h1 className={loginPortalClasses.headline}>
              Collecting insights to drive active community action.
            </h1>
            <p className={loginPortalClasses.lead}>
              Welcome to the YGB Survey Tool. Collect feedback safely, manage field teams, and track progress across
              target communities.
            </p>

            <ul className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, detail }) => (
                <li key={title} className={loginPortalClasses.featureCard}>
                  <span className={loginPortalClasses.featureIcon}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className={loginPortalClasses.featureTitle}>{title}</p>
                    <p className={loginPortalClasses.featureDetail}>{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className={`relative z-10 mt-6 hidden lg:mt-0 lg:block ${loginPortalClasses.footerCopy}`}>
            &copy; {new Date().getFullYear()} Youth Go Budget App
          </p>
        </section>

        {/* Login Form Panel */}
        <section ref={formSectionRef} id="login-form" className={loginPortalClasses.formPanel}>
          <div className="w-full max-w-md">
            <div className={loginPortalClasses.formCard}>
              <div className="mb-6 space-y-2">
                <Link to="/" className={loginPortalClasses.publicLink}>
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back to public dashboard
                </Link>
                <h2 className="text-2xl font-black tracking-tight text-text sm:text-3xl">Sign in</h2>
                <p className="text-xs leading-relaxed text-text-muted">Use your registered phone number and password to open your portal.</p>
              </div>

              {error && (
                <div
                  className="mb-5 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-medium text-rose-700 backdrop-blur-md dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300"
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
                  <PasswordInput
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                </FormField>

                <button type="submit" disabled={loading} className={loginPortalClasses.submitButton}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {loading ? 'Signing in…' : 'Open My Portal'}
                </button>
              </form>
            </div>
          </div>
        </section>

        <p className={`order-3 px-4 pb-8 text-center lg:hidden ${loginPortalClasses.footerCopy}`}>
          &copy; {new Date().getFullYear()} Youth Go Budget App
        </p>
      </div>
      <PwaInstallBanner placement="fixed" />
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, PlusCircle, Users } from 'lucide-react';
import { HttpUserAdapter } from '../../../secondary/api/http-user.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { isValidUgandaPhoneLocal, normalizeUgandaPhoneLocal } from '../../../../core/utils/phone-utils';
import { UGANDA_PHONE_ERROR } from '../../../../core/form-validation';
import { FormField, formControlClassName } from '../components/forms';
import type { UserProfile } from '../../../../core/domain/user.model';

export default function ManageUsers() {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const userRepo = useMemo(() => new HttpUserAdapter(getAccessToken), [getAccessToken]);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [fullName, setFullName] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCollectors = async () => {
    try {
      const collectors = await userRepo.fetchActiveCollectors();
      setUsers(collectors);
    } catch {
      setServerError('Failed to load collector directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCollectors();
  }, [userRepo]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setSuccessMessage('');

    const localValidationErrors: Record<string, string> = {};
    if (!fullName.trim()) localValidationErrors.fullName = 'Full name is required';
    if (!password.trim()) localValidationErrors.password = 'Password is required';
    else if (password.length < 6) localValidationErrors.password = 'Password must be at least 6 characters';
    if (!phoneInput.trim()) localValidationErrors.phoneInput = 'Phone number is required';
    else if (!isValidUgandaPhoneLocal(phoneInput)) {
      localValidationErrors.phoneInput = UGANDA_PHONE_ERROR;
    }

    if (Object.keys(localValidationErrors).length > 0) {
      setErrors(localValidationErrors);
      return;
    }

    setSaving(true);
    try {
      await userRepo.createDataCollector(
        {
          fullName: fullName.trim(),
          phoneNumber: normalizeUgandaPhoneLocal(phoneInput),
          password,
        },
        useAuthStore.getState().user?.id ?? ''
      );
      setSuccessMessage(`Account for "${fullName.trim()}" created successfully.`);
      setFullName('');
      setPhoneInput('');
      setPassword('');
      await loadCollectors();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-text sm:text-xl">Team management</h2>
        <p className="text-sm text-text-muted">Register field collectors and monitor active accounts.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
          <header className="mb-4 space-y-1 border-b border-border pb-3">
            <h3 className="text-sm font-bold text-text">Add Data Collector</h3>
            <p className="text-xs text-text-muted">POST /api/v1/admin/users/data-collectors</p>
          </header>
            {successMessage && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{successMessage}</span>
              </div>
            )}
            {serverError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <FormField label="Full name" htmlFor="fullName" required error={errors.fullName}>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Nakato"
                  className={formControlClassName}
                  disabled={saving}
                />
              </FormField>

              <FormField label="Phone number" htmlFor="phoneInput" required error={errors.phoneInput}>
                <input
                  id="phoneInput"
                  type="tel"
                  inputMode="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. 0772123456"
                  className={formControlClassName}
                  disabled={saving}
                />
              </FormField>

              <FormField label="Initial password" htmlFor="password" required error={errors.password}>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={formControlClassName}
                  disabled={saving}
                />
              </FormField>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-nac-blue text-sm font-semibold text-white transition hover:bg-nac-blue-dark disabled:bg-slate-300"
              >
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                {saving ? 'Saving…' : 'Save Account'}
              </button>
            </form>
        </section>

        <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6 lg:col-span-3">
          <header className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Users className="h-5 w-5 text-brand" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-text">Active Data Collectors</h3>
              <p className="text-xs text-text-muted">Session cache — list API pending on backend</p>
            </div>
          </header>

          {loading ? (
            <p className="py-8 text-center text-sm text-text-muted">Loading directory…</p>
          ) : users.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-8 text-center text-sm text-text-muted">
              No collectors registered in this browser session yet. Create one using the form.
            </p>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {users.map((collector) => (
                  <article
                    key={collector.id}
                    className="rounded-xl border border-border bg-surface-muted/60 p-4"
                  >
                    <p className="font-semibold text-text">{collector.fullName}</p>
                    <p className="mt-1 font-mono text-xs text-text-muted">{collector.phoneNumber}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
                        {collector.role.replace('_', ' ')}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        Active
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-surface-muted text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    <tr>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((collector) => (
                      <tr key={collector.id} className="hover:bg-surface-muted/50">
                        <td className="px-4 py-3 font-medium text-text">{collector.fullName}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">{collector.phoneNumber}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-text-muted">
                          {collector.role.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

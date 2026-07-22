import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  KeyRound,
  PlusCircle,
  UserCircle,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { HttpUserAdapter } from '../../../secondary/api/http-user.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { isValidUgandaPhoneLocal, normalizeUgandaPhoneLocal } from '../../../../core/utils/phone-utils';
import { UGANDA_PHONE_ERROR } from '../../../../core/form-validation';
import { FormField, formControlClassName } from '../components/forms';
import type { UserProfile } from '../../../../core/domain/user.model';
import type { IUserRepositoryPort } from '../../../../ports/user-repository.port';
import { ConfirmActionDialog } from '../admin/ConfirmActionDialog';

const SUCCESS_DISMISS_MS = 5000;

export interface ManageUsersProps {
  userAdmin?: IUserRepositoryPort;
}

function StatusBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
        Active
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">Deactivated</span>
  );
}

interface CollectorRowActionsProps {
  collector: UserProfile;
  onDeactivate: (collector: UserProfile) => void;
  onReactivate: (collector: UserProfile) => void;
  onResetPassword: (collector: UserProfile) => void;
}

function CollectorRowActions({
  collector,
  onDeactivate,
  onReactivate,
  onResetPassword,
}: CollectorRowActionsProps) {
  const isActive = collector.isActive !== false;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        to={`/admin/users/${collector.id}`}
        state={{ collectorName: collector.fullName, phoneNumber: collector.phoneNumber }}
        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-brand hover:bg-surface-muted"
        data-testid={`view-profile-${collector.id}`}
      >
        <UserCircle className="h-3.5 w-3.5" aria-hidden="true" />
        Profile
      </Link>
      {isActive ? (
        <>
          <button
            type="button"
            onClick={() => onResetPassword(collector)}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-text hover:bg-surface-muted"
            data-testid={`reset-password-${collector.id}`}
          >
            <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
            Reset password
          </button>
          <button
            type="button"
            onClick={() => onDeactivate(collector)}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
            data-testid={`deactivate-${collector.id}`}
          >
            <UserMinus className="h-3.5 w-3.5" aria-hidden="true" />
            Deactivate
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => onReactivate(collector)}
          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
          data-testid={`reactivate-${collector.id}`}
        >
          <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
          Reactivate
        </button>
      )}
    </div>
  );
}

export default function ManageUsers({ userAdmin: userAdminProp }: ManageUsersProps = {}) {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRepo = useMemo(
    () => userAdminProp ?? new HttpUserAdapter(getAccessToken),
    [userAdminProp, getAccessToken]
  );

  const [activeUsers, setActiveUsers] = useState<UserProfile[]>([]);
  const [deactivatedUsers, setDeactivatedUsers] = useState<UserProfile[]>([]);
  const [fullName, setFullName] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [pendingDeactivate, setPendingDeactivate] = useState<UserProfile | null>(null);
  const [pendingReset, setPendingReset] = useState<UserProfile | null>(null);
  const [resetResult, setResetResult] = useState<{ fullName: string; temporaryPassword: string } | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const loadCollectors = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const collectors = await userRepo.fetchActiveCollectors();
      setActiveUsers(collectors.map((user) => ({ ...user, isActive: true })));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load collector directory.');
      setActiveUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadCollectors();
  }, [userRepo, isAuthenticated]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(''), SUCCESS_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

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

  const confirmDeactivate = async () => {
    if (!pendingDeactivate) return;
    setActionBusy(true);
    setActionError('');
    try {
      const updated = await userRepo.deactivateUser(pendingDeactivate.id);
      setActiveUsers((current) => current.filter((user) => user.id !== updated.id));
      setDeactivatedUsers((current) => [{ ...updated, isActive: false }, ...current.filter((u) => u.id !== updated.id)]);
      setSuccessMessage(`${updated.fullName} has been deactivated.`);
      setPendingDeactivate(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to deactivate account.');
    } finally {
      setActionBusy(false);
    }
  };

  const confirmReactivate = async (collector: UserProfile) => {
    setActionBusy(true);
    setActionError('');
    try {
      const updated = await userRepo.reactivateUser(collector.id);
      setDeactivatedUsers((current) => current.filter((user) => user.id !== updated.id));
      setActiveUsers((current) => [{ ...updated, isActive: true }, ...current.filter((u) => u.id !== updated.id)]);
      setSuccessMessage(`${updated.fullName} has been reactivated.`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to reactivate account.');
    } finally {
      setActionBusy(false);
    }
  };

  const confirmResetPassword = async () => {
    if (!pendingReset) return;
    setActionBusy(true);
    setActionError('');
    try {
      const result = await userRepo.resetPassword(pendingReset.id);
      setResetResult({ fullName: pendingReset.fullName, temporaryPassword: result.temporaryPassword });
      setPendingReset(null);
      setCopiedPassword(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to reset password.');
    } finally {
      setActionBusy(false);
    }
  };

  const copyTemporaryPassword = async () => {
    if (!resetResult) return;
    await navigator.clipboard.writeText(resetResult.temporaryPassword);
    setCopiedPassword(true);
  };

  const renderCollectorTable = (collectors: UserProfile[], variant: 'active' | 'deactivated') => (
    <>
      <div className="space-y-3 md:hidden">
        {collectors.map((collector) => (
          <article
            key={collector.id}
            className="rounded-xl border border-border bg-surface-muted/60 p-4"
            data-testid={`collector-card-${collector.id}`}
          >
            <p className="font-semibold text-text">{collector.fullName}</p>
            <p className="mt-1 font-mono text-xs text-text-muted">{collector.phoneNumber}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <StatusBadge active={variant === 'active'} />
              <CollectorRowActions
                collector={{ ...collector, isActive: variant === 'active' }}
                onDeactivate={setPendingDeactivate}
                onReactivate={confirmReactivate}
                onResetPassword={setPendingReset}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full min-w-[720px] text-left text-sm" data-testid={`collector-table-${variant}`}>
          <thead className="bg-surface-muted text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {collectors.map((collector) => (
              <tr key={collector.id} className="hover:bg-surface-muted/50" data-testid={`collector-row-${collector.id}`}>
                <td className="px-4 py-3 font-medium text-text">{collector.fullName}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted">{collector.phoneNumber}</td>
                <td className="px-4 py-3">
                  <StatusBadge active={variant === 'active'} />
                </td>
                <td className="px-4 py-3">
                  <CollectorRowActions
                    collector={{ ...collector, isActive: variant === 'active' }}
                    onDeactivate={setPendingDeactivate}
                    onReactivate={confirmReactivate}
                    onResetPassword={setPendingReset}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6" data-testid="manage-users-page">
      <div>
        <h2 className="text-lg font-bold text-text sm:text-xl">Data Collector Management</h2>
        <p className="text-sm text-text-muted">Register field collectors, manage accounts, and view submission history.</p>
      </div>

      <ConfirmActionDialog
        open={pendingDeactivate !== null}
        title="Deactivate collector?"
        message={`${pendingDeactivate?.fullName ?? 'This collector'} will no longer be able to sign in.`}
        confirmLabel="Deactivate"
        destructive
        busy={actionBusy}
        onConfirm={() => void confirmDeactivate()}
        onCancel={() => setPendingDeactivate(null)}
      />

      <ConfirmActionDialog
        open={pendingReset !== null}
        title="Reset password?"
        message={`Generate a new temporary password for ${pendingReset?.fullName ?? 'this collector'}. Their current password will stop working immediately.`}
        confirmLabel="Reset password"
        destructive
        busy={actionBusy}
        onConfirm={() => void confirmResetPassword()}
        onCancel={() => setPendingReset(null)}
      />

      {resetResult && (
        <div
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900"
          data-testid="reset-password-result"
        >
          <p className="font-semibold">Password reset for {resetResult.fullName}</p>
          <p className="mt-2 text-emerald-800">Share this temporary password once. It will not be shown again.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="rounded-lg bg-white px-3 py-2 font-mono text-sm">{resetResult.temporaryPassword}</code>
            <button
              type="button"
              onClick={() => void copyTemporaryPassword()}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              data-testid="copy-temporary-password"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              {copiedPassword ? 'Copied' : 'Copy to clipboard'}
            </button>
            <button
              type="button"
              onClick={() => setResetResult(null)}
              className="text-xs font-semibold text-emerald-700 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {actionError && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{actionError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6 lg:col-span-2">
          <header className="mb-4 space-y-1 border-b border-border pb-3">
            <h3 className="text-sm font-bold text-text">Add Data Collector</h3>
            <p className="text-xs text-text-muted">POST /api/v1/admin/users/data-collectors</p>
          </header>
          {successMessage && (
            <div
              className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
              data-testid="manage-users-success-message"
              role="status"
              aria-live="polite"
            >
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

        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6 lg:col-span-3">
          <header className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Users className="h-5 w-5 text-brand" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-text">Active Data Collectors</h3>
              <p className="text-xs text-text-muted">
                {activeUsers.length} active collector{activeUsers.length === 1 ? '' : 's'}
              </p>
            </div>
          </header>

          {loadError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{loadError}</span>
            </div>
          )}

          {loading ? (
            <p className="py-8 text-center text-sm text-text-muted">Loading directory…</p>
          ) : activeUsers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-8 text-center text-sm text-text-muted">
              No active data collectors found. Register one using the form.
            </p>
          ) : (
            renderCollectorTable(activeUsers, 'active')
          )}
        </section>
      </div>

      {deactivatedUsers.length > 0 && (
        <section
          className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6"
          data-testid="deactivated-collectors-section"
        >
          <header className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <UserMinus className="h-5 w-5 text-text-muted" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-text">Deactivated Collectors</h3>
              <p className="text-xs text-text-muted">
                {deactivatedUsers.length} deactivated account{deactivatedUsers.length === 1 ? '' : 's'} this session
              </p>
            </div>
          </header>
          {renderCollectorTable(deactivatedUsers, 'deactivated')}
        </section>
      )}
    </div>
  );
}

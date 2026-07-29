import { useEffect, useState } from 'react';
import { CalendarRange, CheckCircle2, Loader2 } from 'lucide-react';
import {
  fetchPublicActiveFiscalYear,
  setAdminActiveFiscalYear,
} from '../../../secondary/api/fiscal-year-settings-api.adapter';
import { ApiError } from '../../../../core/api/api-client';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { ActiveFiscalYearSetting } from '../../../../core/domain/active-fiscal-year.model';
import { FormField, FormSelect } from '../components/forms';
import { adminDashboardClasses } from '../../../../core/domain/admin-dashboard.theme';

export function AdminFiscalYearSettingsPanel() {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const checkSilentRefresh = useAuthStore((state) => state.checkSilentRefresh);
  const [setting, setSetting] = useState<ActiveFiscalYearSetting | null>(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetchPublicActiveFiscalYear()
      .then((activeSetting) => {
        if (cancelled) return;
        setSetting(activeSetting);
        setSelectedLabel(activeSetting.fiscalYearLabel);
        setError('');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError('Fiscal year settings are not available yet. Deploy the latest backend and try again.');
          return;
        }
        setError(err instanceof Error ? err.message : 'Unable to load fiscal year settings.');
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    const token = getAccessToken();
    if (!token || !selectedLabel) {
      setError('You must be signed in as an administrator.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      await checkSilentRefresh();
      const refreshedToken = getAccessToken();
      if (!refreshedToken) {
        setError('Your session has expired. Sign out and sign in again, then retry.');
        return;
      }

      const updated = await setAdminActiveFiscalYear(selectedLabel, refreshedToken);
      setSetting(updated);
      setSelectedLabel(updated.fiscalYearLabel);
      setSuccessMessage(`Active fiscal year updated to ${updated.fiscalYearLabel}.`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError('You do not have permission to update fiscal year settings. Sign out and sign in again as an administrator.');
      } else {
        setError(err instanceof Error ? err.message : 'Unable to update fiscal year setting.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      className={`${adminDashboardClasses.panel} space-y-4`}
      data-testid="admin-fiscal-year-settings"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-brand-light/50 p-2 text-brand dark:bg-brand/20">
          <CalendarRange className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-text">LGO collection fiscal year</h2>
          <p className="mt-1 text-xs text-text-muted">
            Set the active fiscal year that LGO enumerators report against. Collectors cannot change this on the form.
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-text-muted" role="status">
          Loading fiscal year settings…
        </p>
      )}

      {error && (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}

      {successMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {!loading && setting && (
        <>
          <FormField label="Current active fiscal year" htmlFor="adminActiveFiscalYearLabel" required>
            <FormSelect
              id="adminActiveFiscalYearLabel"
              value={selectedLabel}
              onChange={setSelectedLabel}
              required
              options={setting.supportedLabels.map((label) => ({
                value: label,
                label: `FY ${label}`,
              }))}
            />
          </FormField>

          {setting.priorFiscalYearLabel && (
            <p className="text-xs text-text-muted">
              Prior-year comparison block on the LGO form will use FY {setting.priorFiscalYearLabel}.
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || selectedLabel === setting.fiscalYearLabel}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-hover disabled:bg-slate-400"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {saving ? 'Saving…' : 'Save fiscal year'}
          </button>
        </>
      )}
    </section>
  );
}

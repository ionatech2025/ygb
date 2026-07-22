import { useEffect, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { FormField, formControlClassName } from '../components/forms/FormField';
import type { LocationFields } from '../../../../core/domain/admin-location.model';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';

export interface AdminDashboardLocationSelectorProps {
  value: LocationFields;
  onChange: (value: LocationFields) => void;
  dashboardApi: IDashboardApiPort;
}

function LocationSelect({
  id,
  label,
  value,
  options,
  onSelect,
  disabled,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  options: Array<{ id: string; name: string }>;
  onSelect: (id: string) => void;
  disabled?: boolean;
  placeholder: string;
}) {
  return (
    <FormField label={label} htmlFor={id}>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onSelect(e.target.value)}
        className={`${formControlClassName} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export function AdminDashboardLocationSelector({
  value,
  onChange,
  dashboardApi,
}: AdminDashboardLocationSelectorProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [districts, setDistricts] = useState<Array<{ id: string; name: string }>>([]);
  const [subcounties, setSubcounties] = useState<Array<{ id: string; name: string }>>([]);
  const [parishes, setParishes] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    let cancelled = false;

    void dashboardApi
      .fetchFilterOptions(value.districtId || undefined, value.subcountyId || undefined)
      .then((options) => {
        if (cancelled) {
          return;
        }
        setDistricts(options.districts);
        setSubcounties(options.subcounties);
        setParishes(options.parishes);
        setLoadError('');
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        setDistricts([]);
        setSubcounties([]);
        setParishes([]);
        setLoadError(err instanceof Error ? err.message : 'Unable to load location filters.');
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dashboardApi, value.districtId, value.subcountyId]);

  const locationDisabled = loading || districts.length === 0;

  return (
    <div className="space-y-4" data-testid="admin-dashboard-location-selector">
      <div className="flex items-center gap-2 text-brand">
        <MapPin className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Location</p>
      </div>

      {loading && (
        <p className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-xs text-text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          Location filters loading…
        </p>
      )}

      {!loading && loadError && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LocationSelect
          id="admin-filter-district"
          label="District"
          value={value.districtId}
          options={districts}
          onSelect={(districtId) =>
            onChange({ districtId, subcountyId: '', parishId: '', villageId: '' })
          }
          disabled={locationDisabled}
          placeholder="Select district…"
        />
        <LocationSelect
          id="admin-filter-subcounty"
          label="Sub-county / Division"
          value={value.subcountyId}
          options={subcounties}
          onSelect={(subcountyId) =>
            onChange({ ...value, subcountyId, parishId: '', villageId: '' })
          }
          disabled={locationDisabled || !value.districtId}
          placeholder="Select sub-county…"
        />
        <LocationSelect
          id="admin-filter-parish"
          label="Parish / Ward"
          value={value.parishId}
          options={parishes}
          onSelect={(parishId) => onChange({ ...value, parishId, villageId: '' })}
          disabled={locationDisabled || !value.subcountyId}
          placeholder="Select parish…"
        />
      </div>
    </div>
  );
}

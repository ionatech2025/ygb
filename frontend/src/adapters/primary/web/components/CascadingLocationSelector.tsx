import type { LocationFields } from '../../../../core/domain/admin-location.model';
import { FormField, formControlClassName } from './forms/FormField';
import { useCascadingLocation } from '../../../../core/hooks/useCascadingLocation';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { Loader2, MapPin } from 'lucide-react';

export interface CascadingLocationSelectorProps {
  value: LocationFields;
  onChange: (value: LocationFields) => void;
  repository?: ILocationRepositoryPort;
  /** When false, parish is the deepest level (admin dashboard filters). Default true. */
  includeVillage?: boolean;
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
    <FormField label={label} htmlFor={id} required>
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

export function CascadingLocationSelector({
  value,
  onChange,
  repository,
  includeVillage = true,
}: CascadingLocationSelectorProps) {
  const {
    loading,
    ready,
    loadError,
    districts,
    subcounties,
    parishes,
    villages,
    setDistrict,
    setSubcounty,
    setParish,
    setVillage,
  } = useCascadingLocation(value, onChange, { repository });

  const locationDisabled = loading || !ready;

  return (
    <div className="space-y-4" data-testid="cascading-location-selector">
      <div className="flex items-center gap-2 text-brand">
        <MapPin className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Location</p>
      </div>

      {loading && (
        <p className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-xs text-text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          Location data loading…
        </p>
      )}

      {!loading && !ready && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          {loadError === 'fetch-failed'
            ? 'Unable to download location data. Check your connection and refresh the page.'
            : 'Location data is unavailable offline. Connect once while online to download the Kampala and Ntungamo dataset.'}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LocationSelect
          id="district"
          label="District"
          value={value.districtId}
          options={districts}
          onSelect={setDistrict}
          disabled={locationDisabled}
          placeholder="Select district…"
        />
        <LocationSelect
          id="subcounty"
          label="Sub-county / Division"
          value={value.subcountyId}
          options={subcounties}
          onSelect={setSubcounty}
          disabled={locationDisabled || !value.districtId}
          placeholder="Select sub-county…"
        />
        <LocationSelect
          id="parish"
          label="Parish / Ward"
          value={value.parishId}
          options={parishes}
          onSelect={setParish}
          disabled={locationDisabled || !value.subcountyId}
          placeholder="Select parish…"
        />
        {includeVillage && (
          <LocationSelect
            id="village"
            label="Village / Zone"
            value={value.villageId}
            options={villages}
            onSelect={setVillage}
            disabled={locationDisabled || !value.parishId}
            placeholder="Select village…"
          />
        )}
      </div>
    </div>
  );
}

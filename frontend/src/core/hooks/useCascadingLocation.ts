import { useCallback, useEffect, useState } from 'react';
import type { AdminLocation } from '../domain/admin-location.model';
import type { LocationFields } from '../domain/admin-location.model';
import type { ILocationRepositoryPort } from '../../ports/location-repository.port';
import { locationRepository } from '../../adapters/secondary/location/location-repository.adapter';
import { locationService } from '../LocationService';

interface UseCascadingLocationOptions {
  repository?: ILocationRepositoryPort;
}

export function useCascadingLocation(
  value: LocationFields,
  onChange: (next: LocationFields) => void,
  options: UseCascadingLocationOptions = {}
) {
  const repository = options.repository ?? locationRepository;
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [districts, setDistricts] = useState<AdminLocation[]>([]);
  const [subcounties, setSubcounties] = useState<AdminLocation[]>([]);
  const [parishes, setParishes] = useState<AdminLocation[]>([]);
  const [villages, setVillages] = useState<AdminLocation[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        await locationService.ensureLoaded();
        const districtList = await repository.findByLevel('DISTRICT');
        if (!cancelled) {
          setDistricts(districtList);
          setReady(districtList.length > 0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [repository]);

  useEffect(() => {
    let cancelled = false;
    async function loadSubcounties() {
      if (!value.districtId) {
        setSubcounties([]);
        return;
      }
      const list = await repository.findByParentId(value.districtId);
      if (!cancelled) setSubcounties(list);
    }
    void loadSubcounties();
    return () => {
      cancelled = true;
    };
  }, [repository, value.districtId]);

  useEffect(() => {
    let cancelled = false;
    async function loadParishes() {
      if (!value.subcountyId) {
        setParishes([]);
        return;
      }
      const list = await repository.findByParentId(value.subcountyId);
      if (!cancelled) setParishes(list);
    }
    void loadParishes();
    return () => {
      cancelled = true;
    };
  }, [repository, value.subcountyId]);

  useEffect(() => {
    let cancelled = false;
    async function loadVillages() {
      if (!value.parishId) {
        setVillages([]);
        return;
      }
      const list = await repository.findByParentId(value.parishId);
      if (!cancelled) setVillages(list);
    }
    void loadVillages();
    return () => {
      cancelled = true;
    };
  }, [repository, value.parishId]);

  const setDistrict = useCallback(
    (districtId: string) => {
      onChange({ districtId, subcountyId: '', parishId: '', villageId: '' });
    },
    [onChange]
  );

  const setSubcounty = useCallback(
    (subcountyId: string) => {
      onChange({ ...value, subcountyId, parishId: '', villageId: '' });
    },
    [onChange, value]
  );

  const setParish = useCallback(
    (parishId: string) => {
      onChange({ ...value, parishId, villageId: '' });
    },
    [onChange, value]
  );

  const setVillage = useCallback(
    (villageId: string) => {
      onChange({ ...value, villageId });
    },
    [onChange, value]
  );

  return {
    loading,
    ready,
    districts,
    subcounties,
    parishes,
    villages,
    setDistrict,
    setSubcounty,
    setParish,
    setVillage,
  };
}

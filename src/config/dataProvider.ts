import { DemandRepository } from '../application/demands/DemandRepository';
import { INITIAL_TASKS } from '../data';
import { LocalStorageDemandRepository } from '../infrastructure/repositories/local/LocalStorageDemandRepository';
import { MockDemandRepository } from '../infrastructure/repositories/mock/MockDemandRepository';

export type DataProvider = 'mock' | 'local' | 'remote';

const DEFAULT_DATA_PROVIDER: DataProvider = 'local';

function isDataProvider(value: string | undefined): value is DataProvider {
  return value === 'mock' || value === 'local' || value === 'remote';
}

export function getConfiguredDataProvider(configured = import.meta.env?.VITE_DATA_PROVIDER): DataProvider {
  if (!configured) {
    return DEFAULT_DATA_PROVIDER;
  }

  if (!isDataProvider(configured)) {
    console.warn(`[Coordena] VITE_DATA_PROVIDER=${configured} e invalido. Usando ${DEFAULT_DATA_PROVIDER} como fallback.`);
    return DEFAULT_DATA_PROVIDER;
  }

  return configured;
}

export function createDemandRepository(provider = getConfiguredDataProvider()): DemandRepository {

  if (provider === 'mock') {
    return new MockDemandRepository(INITIAL_TASKS);
  }

  if (provider === 'remote') {
    console.warn('[Coordena] VITE_DATA_PROVIDER=remote ainda nao possui implementacao dedicada. Usando localStorage apenas como fallback temporario de desenvolvimento.');
  }

  return new LocalStorageDemandRepository({
    storageKey: 'coordflow_tasks',
    seedData: INITIAL_TASKS,
  });
}

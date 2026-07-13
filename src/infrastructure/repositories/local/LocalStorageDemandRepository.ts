import { CreateDemandInput, DemandRepository, UpdateDemandInput } from '../../../application/demands/DemandRepository';
import { Demand } from '../../../domain/demands/Demand';

interface LocalStorageDemandRepositoryOptions {
  storageKey: string;
  seedData: Demand[];
}

export class LocalStorageDemandRepository implements DemandRepository {
  constructor(private readonly options: LocalStorageDemandRepositoryOptions) {}

  async list(): Promise<Demand[]> {
    return this.read();
  }

  async getById(id: string): Promise<Demand | null> {
    const items = this.read();
    return items.find((item) => item.id === id) ?? null;
  }

  async create(input: CreateDemandInput): Promise<Demand> {
    const demand: Demand = {
      ...input,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const nextItems = [demand, ...this.read()];
    this.write(nextItems);

    return { ...demand };
  }

  async update(id: string, input: UpdateDemandInput): Promise<Demand> {
    const items = this.read();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Demand not found: ${id}`);
    }

    const updated: Demand = {
      ...items[index],
      ...input,
    };

    items[index] = updated;
    this.write(items);

    return { ...updated };
  }

  async delete(id: string): Promise<void> {
    const items = this.read();
    const nextItems = items.filter((item) => item.id !== id);
    this.write(nextItems);
  }

  private read(): Demand[] {
    if (typeof window === 'undefined') {
      return this.cloneItems(this.options.seedData);
    }

    try {
      const raw = window.localStorage.getItem(this.options.storageKey);
      if (!raw) {
        return this.cloneItems(this.options.seedData);
      }

      const parsed = JSON.parse(raw) as Demand[];
      return this.cloneItems(parsed);
    } catch {
      return this.cloneItems(this.options.seedData);
    }
  }

  private write(items: Demand[]): Demand[] {
    const safeItems = this.cloneItems(items);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.options.storageKey, JSON.stringify(safeItems));
    }

    return safeItems;
  }

  private cloneItems(items: Demand[]): Demand[] {
    return items.map((item) => ({ ...item }));
  }
}

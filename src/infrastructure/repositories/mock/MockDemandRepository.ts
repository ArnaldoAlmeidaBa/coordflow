import { CreateDemandInput, DemandRepository, UpdateDemandInput } from '../../../application/demands/DemandRepository';
import { Demand } from '../../../domain/demands/Demand';

export class MockDemandRepository implements DemandRepository {
  private items: Demand[];

  constructor(seedData: Demand[]) {
    this.items = this.cloneItems(seedData);
  }

  async list(): Promise<Demand[]> {
    return this.cloneItems(this.items);
  }

  async getById(id: string): Promise<Demand | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async create(input: CreateDemandInput): Promise<Demand> {
    const demand: Demand = {
      ...input,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.items = [demand, ...this.items];
    return { ...demand };
  }

  async update(id: string, input: UpdateDemandInput): Promise<Demand> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Demand not found: ${id}`);
    }

    const updated = {
      ...this.items[index],
      ...input,
    };

    this.items[index] = updated;
    return { ...updated };
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }

  private cloneItems(items: Demand[]): Demand[] {
    return items.map((item) => ({ ...item }));
  }
}

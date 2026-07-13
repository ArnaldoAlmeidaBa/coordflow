import { Demand } from '../../domain/demands/Demand';

export type CreateDemandInput = Omit<Demand, 'id' | 'createdAt'>;
export type UpdateDemandInput = Omit<Demand, 'id' | 'createdAt'>;

export interface DemandRepository {
  list(): Promise<Demand[]>;
  getById(id: string): Promise<Demand | null>;
  create(input: CreateDemandInput): Promise<Demand>;
  update(id: string, input: UpdateDemandInput): Promise<Demand>;
  delete(id: string): Promise<void>;
}

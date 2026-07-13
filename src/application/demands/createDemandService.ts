import { Demand } from '../../domain/demands/Demand';
import { CreateDemandInput, DemandRepository, UpdateDemandInput } from './DemandRepository';

export function createDemandService(repository: DemandRepository) {
  return {
    listDemands(): Promise<Demand[]> {
      return repository.list();
    },

    getDemandById(id: string): Promise<Demand | null> {
      return repository.getById(id);
    },

    createDemand(input: CreateDemandInput): Promise<Demand> {
      return repository.create(input);
    },

    updateDemand(id: string, input: UpdateDemandInput): Promise<Demand> {
      return repository.update(id, input);
    },

    async toggleDemandStatus(id: string): Promise<Demand | null> {
      const current = await repository.getById(id);
      if (!current) {
        return null;
      }

      const nextStatus = current.status === 'concluido' ? 'pendente' : 'concluido';

      return repository.update(id, {
        title: current.title,
        priority: current.priority,
        status: nextStatus,
        deadline: current.deadline,
        category: current.category,
        notes: current.notes,
      });
    },

    deleteDemand(id: string): Promise<void> {
      return repository.delete(id);
    },

    async resetDemands(items: Demand[]): Promise<Demand[]> {
      const existing = await repository.list();
      await Promise.all(existing.map((item) => repository.delete(item.id)));

      const recreated = await Promise.all(items.map((item) => repository.create({
        title: item.title,
        priority: item.priority,
        status: item.status,
        deadline: item.deadline,
        category: item.category,
        notes: item.notes,
      })));

      return recreated;
    },
  };
}

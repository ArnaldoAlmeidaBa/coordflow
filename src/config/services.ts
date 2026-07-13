import { createDemandService } from '../application/demands/createDemandService';
import { createDemandRepository } from './dataProvider';

export const demandService = createDemandService(createDemandRepository());

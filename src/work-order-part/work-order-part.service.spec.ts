import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderPartService } from './work-order-part.service';

describe('WorkOrderPartService', () => {
  let service: WorkOrderPartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkOrderPartService],
    }).compile();

    service = module.get<WorkOrderPartService>(WorkOrderPartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

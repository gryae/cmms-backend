import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderCommentsService } from './work-order-comments.service';

describe('WorkOrderCommentsService', () => {
  let service: WorkOrderCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkOrderCommentsService],
    }).compile();

    service = module.get<WorkOrderCommentsService>(WorkOrderCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderAttachmentsService } from './work-order-attachments.service';

describe('WorkOrderAttachmentsService', () => {
  let service: WorkOrderAttachmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkOrderAttachmentsService],
    }).compile();

    service = module.get<WorkOrderAttachmentsService>(WorkOrderAttachmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

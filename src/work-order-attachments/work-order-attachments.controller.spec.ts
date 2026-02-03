import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderAttachmentsController } from './work-order-attachments.controller';

describe('WorkOrderAttachmentsController', () => {
  let controller: WorkOrderAttachmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrderAttachmentsController],
    }).compile();

    controller = module.get<WorkOrderAttachmentsController>(WorkOrderAttachmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

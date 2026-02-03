import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderCommentsController } from './work-order-comments.controller';

describe('WorkOrderCommentsController', () => {
  let controller: WorkOrderCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrderCommentsController],
    }).compile();

    controller = module.get<WorkOrderCommentsController>(WorkOrderCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

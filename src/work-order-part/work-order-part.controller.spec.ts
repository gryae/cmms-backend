import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderPartController } from './work-order-part.controller';

describe('WorkOrderPartController', () => {
  let controller: WorkOrderPartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrderPartController],
    }).compile();

    controller = module.get<WorkOrderPartController>(WorkOrderPartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

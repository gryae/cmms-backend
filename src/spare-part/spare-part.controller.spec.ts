import { Test, TestingModule } from '@nestjs/testing';
import { SparePartController } from './spare-part.controller';

describe('SparePartController', () => {
  let controller: SparePartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SparePartController],
    }).compile();

    controller = module.get<SparePartController>(SparePartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

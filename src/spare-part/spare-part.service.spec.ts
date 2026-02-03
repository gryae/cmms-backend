import { Test, TestingModule } from '@nestjs/testing';
import { SparePartService } from './spare-part.service';

describe('SparePartService', () => {
  let service: SparePartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SparePartService],
    }).compile();

    service = module.get<SparePartService>(SparePartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

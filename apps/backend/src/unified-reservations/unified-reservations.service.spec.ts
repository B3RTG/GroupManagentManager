import { Test, TestingModule } from '@nestjs/testing';
import { UnifiedReservationsService } from './unified-reservations.service';

describe('UnifiedReservationsService', () => {
  let service: UnifiedReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnifiedReservationsService],
    }).compile();

    service = module.get<UnifiedReservationsService>(UnifiedReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

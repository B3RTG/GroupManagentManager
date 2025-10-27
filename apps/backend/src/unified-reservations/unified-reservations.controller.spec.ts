import { Test, TestingModule } from '@nestjs/testing';
import { UnifiedReservationsController } from './unified-reservations.controller';

describe('UnifiedReservationsController', () => {
  let controller: UnifiedReservationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnifiedReservationsController],
    }).compile();

    controller = module.get<UnifiedReservationsController>(UnifiedReservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

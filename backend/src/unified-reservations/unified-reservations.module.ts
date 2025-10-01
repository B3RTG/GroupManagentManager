import { Module } from '@nestjs/common';
import { UnifiedReservationsController } from './unified-reservations.controller';
import { UnifiedReservationsService } from './unified-reservations.service';

@Module({
  controllers: [UnifiedReservationsController],
  providers: [UnifiedReservationsService]
})
export class UnifiedReservationsModule {}

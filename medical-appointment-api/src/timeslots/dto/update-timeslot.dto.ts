import { IsBoolean } from 'class-validator';

export class UpdateTimeSlotDto {
  @IsBoolean()
  isAvailable: boolean;
}

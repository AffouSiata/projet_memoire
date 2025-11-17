import { IsString, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @IsUUID()
  patientId: string;

  @IsString()
  contenu: string;
}

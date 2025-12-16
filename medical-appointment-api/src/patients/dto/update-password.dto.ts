import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  ancienMotDePasse: string;

  @IsString()
  @MinLength(6)
  nouveauMotDePasse: string;
}

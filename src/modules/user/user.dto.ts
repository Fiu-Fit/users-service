import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  password: string;

  @IsString()
  @IsNotEmpty()
  role: Role;
}

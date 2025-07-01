import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id for the user',
  })
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email for the user',
  })
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    example: 'S3cureP@ssw0rd',
    description: 'The password for the user',
  })
  password: string;
}

export class LoginInput {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email for the user',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'S3cureP@ssw0rd',
    description: 'The password for the user',
  })
  password: string;
}

export class EmailInput {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;
}

export class UpdatePasswordInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'S3cureP@ssw0rd' })
  oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({ example: 'N3wS3cureP@ssw0rd' })
  newPassword: string;
}

export class TokenInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;
}

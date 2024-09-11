import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class ILoginResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class IRegisterResponseDTO {
  email: string;
  name: string;
}

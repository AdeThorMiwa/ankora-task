import { IsEmail, IsNotEmpty } from 'class-validator';

class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export { UserDto };

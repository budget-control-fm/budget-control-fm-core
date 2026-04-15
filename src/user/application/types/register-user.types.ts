export interface RegisterUserCommand {
  fullName: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface RegisterUserResult {
  userId: string;
}

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

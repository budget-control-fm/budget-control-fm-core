export interface RegisterUserCommand {
  fullName: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface RegisterUserResult {
  userId: string;
}

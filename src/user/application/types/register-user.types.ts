export interface RegisterUserCommand {
  fullName: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface RegisterUserResult {
  userId: string;
}

export interface RegisterAuthUserInput {
  id: string;
  email: string;
  password: string;
}

export interface PersistUserProfileInput {
  id: string;
  fullName: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  createdAt: string; // YYYY-MM-DD
  updatedAt: string; // YYYY-MM-DD
}

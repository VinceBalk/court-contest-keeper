
export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  lastActive: string;
  tournamentsParticipated: number;
}

export interface EditUserForm {
  name: string;
  email: string;
  role: string;
  status: string;
}

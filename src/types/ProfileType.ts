export interface Profile {
  id: number;
  login: string;
  password: string;
  username: string;
  email: string;
  phone?: string;
  joinedAt?: string;
  status?: "В сети" | "Не в сети";
  location?: string;
  department?: string;
  aboutMe?: string;
  role?: string;
  avatar?:string;
}

export interface Login {
  login: string;
  password: string;
  token: string;
}

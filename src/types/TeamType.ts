
interface ContactInfo {
  email: string;
  phone: string;
  fax?: string;
}

export interface TeamMember {
  id: number;
  username: string;
  role?: string;
  avatar?: string;
  status?: "В сети" | "Не в сети";
  statustask?: string;
  contactInfo?: ContactInfo;
}

export interface TaskAnalitycs {
    id: number
    username: string,
    role: string,
     status?: "В сети" | "Не в сети";
    tasks: { total: number, done: number, inProgress: number, todo: number },
    efficiency: number,
    workload: number,
}

export interface UserCardProps {
  member: TeamMember;
  isClickable?: boolean;
  onClick?: (member: TeamMember) => void;
}
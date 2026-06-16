export interface Task {
  task_id: number;
  title: string;
  description: string;
  status: string;
  name_task: string;
  CommentTask: string,
  userId:number,
  createAt: string,
  assignedUser?: {
    id: number;
    username: string;
    email?: string;
    avatar?: string;
  };
}

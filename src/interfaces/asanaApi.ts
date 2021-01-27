export interface IResponseFullTask {
  gid: string;
  assignee: IApiEntity;
  assignee_status: string;
  completed: boolean;
  completed_at: string;
  created_at: string;
  due_at: string;
  due_on: string;
  followers: IApiEntity[];
  hearted: boolean;
  hearts: IHeart[];
  liked: boolean;
  likes: IHeart[];
  memberships: IMembership[];
  modified_at: string;
  name: string;
  notes: string;
  num_hearts: number;
  num_likes: number;
  parent: IApiEntity[];
  permalink_url: string;
  projects: IApiEntity[];
  resource_type: string;
  start_on: string;
  tags: IApiEntity[];
  resource_subtype: string;
  workspace: IApiEntity;
}

export interface IApiEntity {
  gid: string;
  name: string;
  resource_type: string;
}

interface IHeart {
  gid: string;
  user: IApiEntity;
}

interface IMembership {
  project: IApiEntity;
  section: IApiEntity;
}

export interface IGetTaskListParams {
  assignee?: string;
  project?: string;
  section?: string;
  workspace?: string;
  completed_since?: string;
  modified_since?: Date;
}

export interface IProject {
  projectName: string;
  tasks: ITasks;
}
export interface ITasks {
  data: IResponseFullTask[];
}

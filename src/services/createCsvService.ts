import fs from 'fs';
import path from 'path';
import { Writable } from 'stream';
import { IApiEntity, IProject } from '../interfaces/asanaApi';

export default class CreateCsvService {
  private users: string[] = [];

  private workspaces: string[] = [];

  public createCsv(projectTasks: IProject[]): void {
    this.createCsvDirectory(path.resolve(__dirname, '../../csv'));
    const projectsCsv = fs.createWriteStream(this.getPath('project'));
    const tasksCsv = fs.createWriteStream(this.getPath('tasks'));
    const usersCsv = fs.createWriteStream(this.getPath('users'));
    const workspacesCsv = fs.createWriteStream(this.getPath('workspaces'));
    const tagsCsv = fs.createWriteStream(this.getPath('tags'));
    const membershipsCsv = fs.createWriteStream(this.getPath('memberships'));

    this.createCsvData(projectTasks, projectsCsv, tasksCsv, usersCsv, workspacesCsv, tagsCsv, membershipsCsv);
  }

  private createCsvData(
    projectTasks: IProject[],
    projectsCsv: Writable,
    tasksCsv: Writable,
    usersCsv: Writable,
    workspacesCsv: Writable,
    tagsCsv: Writable,
    membershipsCsv: Writable
  ): void {
    this.addHeaderCsv(projectTasks, projectsCsv, tasksCsv, usersCsv, workspacesCsv, tagsCsv, membershipsCsv);

    projectTasks.forEach((project) => {
      project.tasks.data.forEach((task) => {
        projectsCsv.write(`${project.projectName};${task.gid} \n`);
        tasksCsv.write(`${this.getTaskProperty(task)} \n`);

        task.followers.forEach((user) => {
          if (!this.users.some((gid) => gid === user.gid)) {
            this.users.push(user.gid);
            usersCsv.write(`${user.gid};${user.name};${user.resource_type} \n`);
          }
        });

        if (!this.workspaces.some((gid) => gid === task.workspace.gid)) {
          this.workspaces.push(task.workspace.gid);
          workspacesCsv.write(`${task.workspace.gid};${task.workspace.name};${task.workspace.resource_type} \n`);
        }

        task.memberships.forEach((memberships) => {
          membershipsCsv.write(
            `${task.gid};${memberships.project.gid};${memberships.project.name};${memberships.project.resource_type};${memberships.section.gid};${memberships.section.name};${memberships.section.resource_type} \n`
          );
        });

        task.tags.forEach((tags) => {
          tagsCsv.write(`${task.gid};${tags.gid};${tags.name};${tags.resource_type} \n`);
        });
      });
    });
  }

  private getTaskPropertyNames(task: IApiEntity): string {
    return Object.keys(task).join(';');
  }

  private getTaskProperty(task: IApiEntity): string {
    let properties = '';

    for (const key in task) {
      const value =
        typeof task[key] === 'object'
          ? JSON.stringify(task[key]).split(',').join(' ')
          : typeof task[key] === 'string'
          ? task[key].split(/,|\n|;/).join(' ')
          : task[key];

      properties = properties === '' ? `${value}` : `${properties}; ${value}`;
    }

    return properties;
  }

  private addHeaderCsv(
    projectTasks: IProject[],
    projectsCsv: Writable,
    tasksCsv: Writable,
    usersCsv: Writable,
    workspacesCsv: Writable,
    tagsCsv: Writable,
    membershipsCsv: Writable
  ) {
    projectsCsv.write(`project_name;task_gid \n`);
    tasksCsv.write(`${this.getTaskPropertyNames(projectTasks[0].tasks.data[0])} \n`);
    usersCsv.write(`gid;name;resource_type \n`);
    workspacesCsv.write(`gid;name;resource_type \n`);
    tagsCsv.write(`task_gid;gid;name;resource_type \n`);
    membershipsCsv.write(
      `task_gid;project_gid;project_name;project_resource_type;section_gid;section_name;section_resource_type \n`
    );
  }

  private createCsvDirectory(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }

  private getPath(fileName: string): string {
    return path.resolve(__dirname, `../../csv/${fileName}.csv`);
  }
}

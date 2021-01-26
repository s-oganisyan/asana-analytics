import fs from 'fs';
import path from 'path';
import ParseStringService from './parseStringService';
import { Writable } from 'stream';
import { IApiEntity, IProject, IResponseFullTask } from '../interfaces/asanaApi';

export default class WriteCsvService {
  private users: string[] = [];

  private workspaces: string[] = [];

  readonly projectFields: string = 'project_name;task_gid \n';

  readonly userFields: string = 'gid;name;resource_type \n';

  readonly workspaceFields: string = 'gid;name;resource_type \n';

  readonly tagFields: string = 'task_gid;gid;name;resource_type \n';

  readonly membershipFields: string =
    'task_gid;project_gid;project_name;project_resource_type;section_gid;section_name;section_resource_type \n';

  public createCsv(projectTasks: IProject[], dirName = 'csv'): void {
    this.createCsvDirectory(path.resolve(__dirname, `../../${dirName}`));

    this.createCsvData(
      projectTasks,
      this.createStreamForWriteCsv('project'),
      this.createStreamForWriteCsv('tasks'),
      this.createStreamForWriteCsv('users'),
      this.createStreamForWriteCsv('workspaces'),
      this.createStreamForWriteCsv('tags'),
      this.createStreamForWriteCsv('memberships')
    );
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
    this.addColumnsNamesCsv(projectTasks, projectsCsv, tasksCsv, usersCsv, workspacesCsv, tagsCsv, membershipsCsv);

    projectTasks.forEach((project) => {
      project.tasks.data.forEach((task) => {
        projectsCsv.write(`${project.projectName};${task.gid} \n`);
        tasksCsv.write(`${this.getTaskProperty(task)} \n`);

        this.writeCsvUsers(task, usersCsv);
        this.writeCsvWorkspaces(task, workspacesCsv);
        this.writeCsvMemberships(task, membershipsCsv);
        this.writeCsvTags(task, tagsCsv);
      });
    });
  }

  private getTaskPropertyNames(task: IApiEntity): string {
    return Object.keys(task).join(';');
  }

  private getTaskProperty(task: IApiEntity): string {
    let properties = '';

    for (const key in task) {
      const value = ParseStringService.removeSymbolsInString(task[key]);
      properties = properties === '' ? `${value}` : `${properties}; ${value}`;
    }

    return properties;
  }

  private addColumnsNamesCsv(
    projectTasks: IProject[],
    projectsCsv: Writable,
    tasksCsv: Writable,
    usersCsv: Writable,
    workspacesCsv: Writable,
    tagsCsv: Writable,
    membershipsCsv: Writable
  ) {
    projectsCsv.write(this.projectFields);
    tasksCsv.write(`${this.getTaskPropertyNames(projectTasks[0].tasks.data[0])} \n`);
    usersCsv.write(this.userFields);
    workspacesCsv.write(this.workspaceFields);
    tagsCsv.write(this.tagFields);
    membershipsCsv.write(this.membershipFields);
  }

  private createCsvDirectory(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }

  private createStreamForWriteCsv(fileName: string): Writable {
    return fs.createWriteStream(this.getPath(fileName));
  }

  private getPath(fileName: string): string {
    return path.resolve(__dirname, `../../csv/${fileName}.csv`);
  }

  private writeCsvUsers(task: IResponseFullTask, usersCsv: Writable): void {
    task.followers.forEach((user) => {
      this.checkExistRecordAndWrite(
        this.users,
        usersCsv,
        user.gid,
        `${user.gid};${user.name};${user.resource_type} \n`
      );
    });
  }

  private writeCsvWorkspaces(task: IResponseFullTask, workspacesCsv: Writable): void {
    this.checkExistRecordAndWrite(
      this.workspaces,
      workspacesCsv,
      task.workspace.gid,
      `${task.workspace.gid};${task.workspace.name};${task.workspace.resource_type} \n`
    );
  }

  private writeCsvMemberships(task: IResponseFullTask, membershipsCsv: Writable): void {
    task.memberships.forEach((memberships) => {
      membershipsCsv.write(
        `${task.gid};${memberships.project.gid};${memberships.project.name};${memberships.project.resource_type};${memberships.section.gid};${memberships.section.name};${memberships.section.resource_type} \n`
      );
    });
  }

  private writeCsvTags(task: IResponseFullTask, tagsCsv: Writable): void {
    task.tags.forEach((tags) => {
      tagsCsv.write(`${task.gid};${tags.gid};${tags.name};${tags.resource_type} \n`);
    });
  }

  private checkExistRecordAndWrite(array: string[], writeStream: Writable, gid: string, writeString: string) {
    if (!array.some((arrayGid) => arrayGid === gid)) {
      array.push(gid);
      writeStream.write(writeString);
    }
  }
}

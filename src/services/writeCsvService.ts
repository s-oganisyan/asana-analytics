import fs from 'fs';
import path from 'path';
import DateService from './dateService';
import ParseStringService from './parseStringService';
import { Writable } from 'stream';
import { IProject, IResponseFullTask } from '../interfaces/asanaApi';

export default class WriteCsvService {
  private readonly dirName: string;

  private users: string[] = [];

  private workspaces: string[] = [];

  private readonly projectFields: string = 'project_name;task_gid \n';

  private readonly userFields: string = 'gid;name;resource_type \n';

  private readonly workspaceFields: string = 'gid;name;resource_type \n';

  private readonly tagFields: string = 'task_gid;gid;name;resource_type \n';

  private readonly membershipFields: string =
    'task_gid;project_gid;project_name;project_resource_type;section_gid;section_name;section_resource_type \n';

  constructor(dirName = 'csv') {
    this.dirName = dirName;
  }

  public createCsv(projectTasks: IProject[]): void {
    this.createCsvDirectory(path.resolve(__dirname, `../../${this.dirName}`));

    this.writeCsvData(
      projectTasks,
      this.createStreamForWriteCsv('project'),
      this.createStreamForWriteCsv('tasks'),
      this.createStreamForWriteCsv('users'),
      this.createStreamForWriteCsv('workspaces'),
      this.createStreamForWriteCsv('tags'),
      this.createStreamForWriteCsv('memberships')
    );
  }

  private writeCsvData(
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
        this.fixPropertyDateTask(task);
        tasksCsv.write(`${this.getTaskProperty(task)};${this.doneRequestTime(task)} \n`);

        this.writeCsvUsers(task, usersCsv);
        this.writeCsvWorkspaces(task, workspacesCsv);
        this.writeCsvMemberships(task, membershipsCsv);
        this.writeCsvTags(task, tagsCsv);
      });
    });
  }

  private getTaskProperty(task: IResponseFullTask): string {
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
    tasksCsv.write(`${this.getTaskPropertyNames(projectTasks[0].tasks.data[0])};done_request_time \n`);
    usersCsv.write(this.userFields);
    workspacesCsv.write(this.workspaceFields);
    tagsCsv.write(this.tagFields);
    membershipsCsv.write(this.membershipFields);
  }

  private getTaskPropertyNames(task: IResponseFullTask): string {
    return Object.keys(task).join(';');
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
    return path.resolve(__dirname, `../../${this.dirName}/${fileName}.csv`);
  }

  private writeCsvUsers(task: IResponseFullTask, usersCsv: Writable): void {
    if (!task.followers) {
      return;
    }

    task.followers.forEach((user) => {
      this.checkExistRecordAndWrite(
        this.users,
        usersCsv,
        user.gid,
        `${user.gid.trim()};${user.name.trim()};${user.resource_type.trim()} \n`
      );
    });

    if (!task.assignee) {
      return;
    }
    this.checkExistRecordAndWrite(
      this.users,
      usersCsv,
      task.assignee.gid,
      `${task.assignee.gid.trim()};${task.assignee.name.trim()};${task.assignee.resource_type.trim()} \n`
    );
  }

  private writeCsvWorkspaces(task: IResponseFullTask, workspacesCsv: Writable): void {
    if (!task.workspace) {
      return;
    }

    this.checkExistRecordAndWrite(
      this.workspaces,
      workspacesCsv,
      task.workspace.gid,
      `${task.workspace.gid.trim()};${task.workspace.name.trim()};${task.workspace.resource_type.trim()} \n`
    );
  }

  private writeCsvMemberships(task: IResponseFullTask, membershipsCsv: Writable): void {
    if (!task.memberships) {
      return;
    }

    task.memberships.forEach((memberships) => {
      membershipsCsv.write(
        `${task.gid.trim()};${memberships.project.gid.trim()};${memberships.project.name.trim()};${memberships.project.resource_type.trim()};${memberships.section.gid.trim()};${memberships.section.name.trim()};${memberships.section.resource_type.trim()} \n`
      );
    });
  }

  private writeCsvTags(task: IResponseFullTask, tagsCsv: Writable): void {
    if (!task.tags) {
      return;
    }

    task.tags.forEach((tags) => {
      tagsCsv.write(`${task.gid.trim()};${tags.gid.trim()};${tags.name.trim()};${tags.resource_type.trim()} \n`);
    });
  }

  private checkExistRecordAndWrite(array: string[], writeStream: Writable, gid: string, writeString: string) {
    if (!array.some((arrayGid) => arrayGid === gid)) {
      array.push(gid);
      writeStream.write(writeString);
    }
  }

  private fixPropertyDateTask(task: IResponseFullTask): void {
    const properties = Object.keys(task);
    properties.forEach((property) => {
      if (task[property] != null && (property.endsWith('_at') || property.endsWith('_on'))) {
        task[property] = DateService.changeTimezone(task[property]);
      }
    });
  }

  private doneRequestTime(task: IResponseFullTask): number {
    const createAt = new Date(task.created_at);
    const modifiedAt = new Date(task.modified_at);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return modifiedAt - createAt;
  }
}

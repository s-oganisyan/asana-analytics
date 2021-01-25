import fs from 'fs';
import path from 'path';
import { Writable } from 'stream';
import { IApiEntity, IProject } from '../interfaces/asanaApi';

export default class CreateCsvService {
  public createCsv(projectTasks: IProject[], CsvNameProjectsTaskGid: string, CsvNameTasks: string): void {
    const projectsCsv = fs.createWriteStream(path.resolve(__dirname, `../../${CsvNameProjectsTaskGid}.csv`), {
      flags: 'a',
    });
    const tasksCsv = fs.createWriteStream(path.resolve(__dirname, `../../${CsvNameTasks}.csv`));

    this.createCsvProjectsTasksGidAndTasks(projectTasks, projectsCsv, tasksCsv);
  }

  private createCsvProjectsTasksGidAndTasks(projectTasks: IProject[], projectsCsv: Writable, tasksCsv: Writable): void {
    this.addHeaderCsv(projectTasks, projectsCsv, tasksCsv);
    projectTasks.forEach((project) => {
      project.tasks.data.forEach((task) => {
        projectsCsv.write(`${project.projectName};${task.gid} \n`);
        tasksCsv.write(`${this.getTaskProperty(task)} \n`);
      });
    });
  }

  private getTaskPropertyNames(task: IApiEntity): string {
    return Object.keys(task).join(';');
  }

  private getTaskProperty(task: IApiEntity): string {
    let properties = '';

    for (const key in task) {
      const value = typeof task[key] !== 'object' ? task[key] : JSON.stringify(task[key]).split(',').join(' ');
      properties = properties === '' ? `${value}` : `${properties}; ${value}`;
    }

    return properties;
  }

  private addHeaderCsv(projectTasks: IProject[], projectsCsv: Writable, tasksCsv: Writable) {
    projectsCsv.write(`project_name;task_gid \n`);
    tasksCsv.write(`${this.getTaskPropertyNames(projectTasks[0].tasks.data[0])} \n`);
  }
}

import logger from '../config/logger';
const winston = logger();

export default class Logger {
  static error(error: string): void {
    winston.log({
      message: error,
      label: this.getFixedPathFile(),
      level: 'error',
    });
  }

  static info(message: string): void {
    winston.log({
      message,
      label: this.getFixedPathFile(),
      level: 'info',
    });
  }

  static debug(message: string): void {
    winston.log({
      message: `###${message}`,
      level: 'debug',
      label: this.getFixedPathFile(),
    });
  }

  private static getFixedPathFile(): string {
    try {
      throw new Error();
    } catch (e) {
      const path = e.stack
        .split('at')[4]
        .match(/\((.*)\)/)[1]
        .split('/');
      return `${path[path.length - 2]}/${path[path.length - 1]}`;
    }
  }
}

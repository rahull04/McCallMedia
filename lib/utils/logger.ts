import {NODE_ENV} from '@env';

enum LogLevel {
  LOG = 'LOG',
  WARN = 'WARNING',
  ERROR = 'ERROR',
}

interface Options {
  name: string;
}

export class Logger {
  private name;

  constructor(options: Options) {
    this.name = options.name;
  }

  private get isDev() {
    return NODE_ENV === 'dev';
  }

  public log(...message: any[]) {
    if (this.isDev) {
      return this.logMessage(...message);
    }
  }

  public warn(...message: any[]) {
    if (this.isDev) {
      return this.warnMessage(...message);
    }
  }

  public error(...message: any[]) {
    if (this.isDev) {
      return this.errorMessage(...message);
    }
  }

  private logMessage(...message: string[]) {
    console.log(`${LogLevel.LOG}(${this.name}):`, ...message);
  }

  private warnMessage(...message: string[]) {
    console.warn(`${LogLevel.WARN}(${this.name}):`, ...message);
  }

  private errorMessage(...message: string[]) {
    console.error(`${LogLevel.ERROR}(${this.name}):`, ...message);
  }
}

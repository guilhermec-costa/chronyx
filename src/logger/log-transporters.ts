export interface LogTransport {
  log(message: string): void;
}

export namespace CronLogTransport {
  export class ConsoleTransport implements LogTransport {
    log(msg: string) {
      console.log(msg);
    }
  }

  export class FilesystemTransport implements LogTransport {
    log(message: string): void {
      console.log("File system transport");
    }
  }
}

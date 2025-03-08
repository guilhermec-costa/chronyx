import fs from "fs";

export interface LogTransport {
  log(message: string): void;
}

export namespace CronLogTransport {
  export class ConsoleTransport implements LogTransport {
    log(msg: string) {
      console.log(msg);
    }
  }

  export type FilesystemTransportOptions = {
    filepath: string;
  };
  export class FilesystemTransport implements LogTransport {
    private fileStream: fs.WriteStream;

    constructor(private readonly opts: FilesystemTransportOptions) {
      this.fileStream = fs.createWriteStream(opts.filepath);
    }

    log(message: string): void {
      this.fileStream.write(`${message}\n`);
    }
  }
}

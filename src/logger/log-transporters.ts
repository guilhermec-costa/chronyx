import fs from "fs";

/**
 * `LogTransport` is an interface that defines the contract for log transport mechanisms.
 * It includes a method to log messages to a specified destination.
 *
 * @interface LogTransport
 */
export interface LogTransport {
  log(message: string): void;
}

/**
 * The `CronLogTransport` namespace contains various log transport implementations,
 * including console and file system-based logging mechanisms.
 *
 */
export namespace CronLogTransport {
  /**
   * `ConsoleTransport` is a log transport that logs messages to the console.
   */
  export class ConsoleTransport implements LogTransport {
    /**
     * Logs a message to the console.
     *
     * @param {string} msg - The message to be logged.
     */
    log(msg: string) {
      console.log(msg);
    }
  }

  /**
   * Options for configuring the `FilesystemTransport`.
   *
   * @typedef FilesystemTransportOptions
   * @type {object}
   * @property {string} filepath - The path to the log file where messages will be written.
   */
  export type FilesystemTransportOptions = {
    filepath: string;
  };

  /**
   * `FilesystemTransport` is a log transport that writes messages to a file system.
   *
   * @class FilesystemTransport
   * @implements {LogTransport}
   */
  export class FilesystemTransport implements LogTransport {
    private fileStream: fs.WriteStream;

    /**
     * Creates an instance of `FilesystemTransport`.
     *
     * @param {FilesystemTransportOptions} opts - The configuration options for the transport, including the file path.
     */
    constructor(private readonly opts: FilesystemTransportOptions) {
      this.fileStream = fs.createWriteStream(opts.filepath);
    }

    /**
     * Logs a message to the configured log file.
     *
     * @param {string} message - The message to be logged.
     */
    log(message: string): void {
      this.fileStream.write(`${message}\n`);
    }
  }
}

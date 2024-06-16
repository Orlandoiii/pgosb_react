
/** Signature of a logging function */
export interface LogFn {
    (message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface */
export interface Logger {
    log: LogFn;
    warn: LogFn;
    error: LogFn;
}

/** Log levels */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const NO_OP: LogFn = (message?: any, ...optionalParams: any[]) => { };

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
    readonly log: LogFn;
    readonly info: LogFn;
    readonly warn: LogFn;
    readonly error: LogFn;

    constructor(options?: { level?: LogLevel }) {
        const { level } = options || {};

        this.error = console.error.bind(console);

        if (level === 'ERROR') {
            this.warn = NO_OP;
            this.info = NO_OP;
            this.log = NO_OP;

            return;
        }

        this.warn = console.warn.bind(console);

        if (level === 'WARN') {

            this.info = NO_OP;
            this.log = NO_OP;

            return;
        }

        this.info = console.info.bind(console);

        if (level === "INFO") {
            this.log = NO_OP;
            return;
        }

        this.log = console.log.bind(console);
    }
}


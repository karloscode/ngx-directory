import { ILoggingConfiguration, ILoggingData, ILoggingFullData } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { LoggingService } from './logging.service';

export abstract class LogWriter {
    protected configs: ILoggingConfiguration
    protected targetEntry: ILoggingFullData
    private applicationName: string

    constructor(loggingService: LoggingService) {
        this.applicationName = environment.applicationName
        this.configs = environment.logging
        loggingService.logEntries$.subscribe(log => this.handleLogEntry(log))
    }

    /**
     * Use this method to execute the write process for the
     * specified [Log Entry] item.
     *
     * Using the [template method] design pattern.
     */
    execute() {
        this.preWritting();
        if (this.validateEntry()) {
            this.write();
        }
        this.finish();
    }

    /**
     * Use to perform an setup or configuration of the [writer].
     * The [setup] method runs on all executions of the writer - and
     * is called before the [write] method.
     */
    preWritting() {}

    /**
     * Use to validate the [log entry] before attempting to write
     * using the specified [log writer].
     *
     * Returns a [false] boolean to indicate the item is not valid.
     */
    validateEntry(): boolean {
        // no validate for now
        return true
    }

    /**
     * Use to implement the actual write of the [Log Entry].
     */
    abstract write();

    /**
     * Use to finish the process or clean-up any resources.
     */
    finish() { }

    private handleLogEntry(logEntry: ILoggingData) {
        this.targetEntry = this.getLoggingData(logEntry)
        this.execute();
    }

    private getLoggingData(data: ILoggingData): ILoggingFullData {
        return {
            timestamp: new Date().getTime(),
            applicationName: this.applicationName,
            level: data.level,
            ...data,
        }
    }
}

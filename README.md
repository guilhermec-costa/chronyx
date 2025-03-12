# Chronyx

Chronyx is a flexible and efficient task scheduling library for Node.js, supporting cron-like expressions, fixed intervals, and one-time executions.

## Features

- **Cron Expression Scheduling**: Schedule tasks using standard cron expressions.
- **Fixed Interval Execution**: Run tasks repeatedly at a specified time interval.
- **One-Time Execution**: Schedule tasks to run once at a specific time.
- **Task Management**: List, stop, and manage scheduled tasks.
- **Timezone Support**: Schedule tasks using specific time zones.
- **Task Previews**: Preview future and past execution times.

## Installation

```bash
pnpm install chronyx
```

## Usage

### Basic Example

```typescript
import { Chronos } from "chronyx";

export const scheduler = new Chronos({
  initializationMethod: "autoStartAll",
  logger: {
    level: CronLogLevel.INFO,
    transporters: [new CronLogTransport.ConsoleTransport()],
  },
});

// Schedule a task using a cron expression
scheduler.schedule("*/5 * * * *", () => {
  console.log("Task executed every 5 minutes");
});

// Schedule a task using a pre defined enum option cron expression
scheduler.schedule(CronExpressions.EVERY_5_SECONDS, () => {
  console.log("Task executed every 5 minutes");
});

// Schedule a task to run every 10 seconds
scheduler.execEvery(10, () => {
  console.log("Task executed every 10 seconds");
});

// Schedule a one-time task
scheduler.oneShot(new Date(Date.now() + 60000), () => {
  console.log("Task executed after 1 minute");
});

scheduler.makeCron({
  expr: CronExpressions.EVERY_5_SECONDS,
  handler: () => {
    console.log("Testing make cron method");
  },
});
```

## API

### `new Chronos(config?: ConfigOptions)`

Creates a new Chronos scheduler instance.

- `config` _(optional)_: Configuration object for the scheduler.
  If not specified, uses the default configuration

### `schedule(expr: string | number, handler: VoidFunction, options?: SchedulingOptions): Task`

Schedules a task.

- `expr`: Cron expression (e.g., `"*/5 * * * *"`) or a number (in seconds for intervals).
- `handler`: Function to execute.
- `options`: Optional scheduling options (e.g., `timeZone`).

### `execEvery(freq: number, handler: VoidFunction, options?: SchedulingOptions): Task`

Schedules a task to run at a fixed frequency.

- `freq`: Frequency in seconds.
- `handler`: Function to execute.
- `options`: Optional scheduling options.

### `oneShot(moment: Date, handler: VoidFunction, options?: SchedulingOptions): Task`

Schedules a one-time task.

- `moment`: Date of execution.
- `handler`: Function to execute.
- `options`: Optional scheduling options.

### `listTasks(): void`

Prints all registered tasks to the console.

### `tasks(): Task[]`

Returns an array of all scheduled tasks.

### `previewNext(expr: string, n?: number, tz?: string): Date[]`

Generates future execution times based on a cron expression.

- `expr`: Cron expression.
- `n`: Number of future execution times (default: 10).
- `tz`: Timezone (optional).

### `validateCron(expr: string): boolean`

Validates a cron expression.

- `expr`: Cron expression to validate.

### `matchesCron(moment: Date, cron: CronParts): boolean`

Checks if a date matches a cron pattern.

- `moment`: Date to check.
- `cron`: Cron pattern to match against.

## Example: Task Management

```typescript
import { Chronos } from "chronos-scheduler";

const scheduler = new Chronos();

const task = scheduler.schedule("*/2 * * * *", () => {
  console.log("This task runs every 2 minutes");
});

// Stop the task after 10 minutes
setTimeout(() => {
  task.stop();
  console.log("Task stopped");
}, 600000);
```

## Cron Expression Format

| Field        | Allowed Values            | Special Characters |
| ------------ | ------------------------- | ------------------ |
| Seconds      | 0-59                      | `, - * /`          |
| Minutes      | 0-59                      | `, - * /`          |
| Hours        | 0-23                      | `, - * /`          |
| Day of Month | 1-31                      | `, - * / ?`        |
| Month        | 1-12 or JAN-DEC           | `, - * /`          |
| Day of Week  | 0-6 (Sunday=0) or SUN-SAT | `, - * / ?`        |

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License.

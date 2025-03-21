# Chronyx

> ⚠️ **Note:** This project is in the early stages of development and is considered **unstable**. Interfaces and behaviors may change without prior notice.

## Introduction

`Chronyx` is a flexible and extensible task scheduler that supports:

- Cron-like scheduling using expressions.
- One-time tasks ("one-shot" executions).
- Recurring tasks at fixed intervals.
- Task introspection (listing and previewing future/past executions).

## Configuration

You can configure the Chronos scheduler using the `ConfigOptions` object. Here are the available configuration options:

```typescript
export const DefaultChronosConfig: ConfigOptions = {
  logger: {
    level: CronLogLevel.INFO, // Log level (INFO, DEBUG, ERROR)
    transporters: [new CronLogTransport.ConsoleTransport()], // Outputs logs to the console
  },
};

export const DefaultSchedulingOptions: SchedulingOptions = {
  autoStart: true, // Automatically start tasks by default
};
```

### ConfigOptions

| Property | Type          | Description                                |
| -------- | ------------- | ------------------------------------------ |
| logger   | LoggerOptions | Customizes log levels and log destinations |

### LoggerOptions

| Property     | Type               | Description                               |
| ------------ | ------------------ | ----------------------------------------- |
| level        | CronLogLevel       | Log level (INFO, DEBUG, ERROR)            |
| transporters | CronLogTransport[] | Array of log transporters (console, file) |

## Creating a Chronos Instance

You can initialize Chronos with the default configuration or provide custom options:

```typescript
const c1 = new Chronos();
/* Assumes the default configuration
{
  logger: {
    level: CronLogLevel.INFO,
    transporters: [new CronLogTransport.ConsoleTransport()],
  },
};
*/

// Custom cron manager
const c2 = new Chronos({
  logger: {
    level: CronLogLevel.DEBUG,
    transporters: [
      new CronLogTransport.ConsoleTransport(),
      new CronLogTransport.FilesystemTransport({ filepath: "cron-logs" }), // logs to the filesystem specified path
    ],
  },
});
```

## Scheduling Tasks

### Recurring Tasks (Fixed Interval)

Use `execEvery` to schedule a recurring task that runs every fixed number of seconds:

```typescript
c1.execEvery(
  1000,
  () => {
    console.log("hello world");
  },
  {
    name: "Task test",
  }
);
```

### Cron Expression Tasks

You can schedule tasks using standard cron syntax:

```typescript
c1.schedule(
  "* * * * * *",
  () => {
    console.log("every second");
  },
  {
    name: "scheduler cron",
    timeZone: "America/Sao_Paulo",
    debugTick: () => console.log("Ticking every second"),
  }
);
```

### One-Time Tasks

Schedule a one-shot task to run at a specific date/time:

```typescript
const now = addSeconds(new Date(), 60000);
c1.oneShot(
  now,
  () => {
    console.log("One shot function");
  },
  {
    name: "One shot cron",
    debugTick: () => console.log("Ticking"),
  }
);
```

### Using makeCron

`makeCron` is a shorthand for scheduling cron-like tasks:

```typescript
c1.makeCron({
  expr: CronExpressions.EVERY_10_SECONDS,
  handler: () => console.log("Every 10 seconds"),
  options: { name: "test cron" },
});
```

---

### **Important**:

Every scheduling performed (scheduler, execEvery, oneShot or makeCron methods) returns a task object, which can be used for all task introspection operations

## Introspection Methods

### Task operations

```typescript
const task = chronos.schedule(
  CronExpressions.EVERY_5_MINUTES,
  () => {
    console.log("every second");
  },
  {
    autoStart: false,
  }
);

task.getStatus();
task.kill();
task.prettyPrint();
task.setHandler();
task.getCronParts(); // only valid values for expression based crons. Otherwise, it will return undefined
task.start();
```

### Pretty print the list of tasks

```typescript
c1.listTasks(); // Logs all registered tasks to the console
```

### Access All Tasks

```typescript
const allTasks = c1.tasks(); // Returns an array of Task objects
```

### Preview Next Executions

```typescript
const futureExecutions = c1.previewNext(
  CronExpressions.EVERY_10_MINUTES,
  10,
  "America/Sao_Paulo"
);
console.log(futureExecutions);
```

### Preview Past Executions

```typescript
const pastExecutions = c1.previewPast(
  CronExpressions.EVERY_10_MINUTES,
  10,
  "America/Sao_Paulo"
);
console.log(pastExecutions);
```

## Validating and Matching Cron Expressions

### Validate Cron Expression

```typescript
const isValid = c1.validateCron("* * * * * *"); // Returns true
const isInvalid = c1.validateCron("* a b c 0"); // Returns false
```

### Match Date Against Cron

```typescript
const matches = c1.matchesCron(new Date(), CronExpressions.EVERY_15_MINUTES);
console.log(matches); // true or false
```

## Advanced Usage

### Custom Timezones

Tasks can be scheduled in specific timezones using the `timeZone` option:

```typescript
c1.schedule(
  "0 0 * * *",
  () => {
    console.log("Midnight task");
  },
  {
    name: "Midnight Task",
    timeZone: "America/New_York",
  }
);
```

### Debugging Task Execution

Use the `debugTick` option to log each tick before task execution:

```typescript
c1.schedule(
  "*/5 * * * * *",
  () => {
    console.log("Runs every 5 seconds");
  },
  {
    debugTick: () => console.log("Ticking..."),
  }
);
```

## Decorator-Based Scheduling (for Typescript)

Chronos supports method scheduling through decorators, allowing you to annotate class methods for execution based on cron expressions, timeouts, one-shot tasks, and recurring intervals.

### `@Scheduler(expression: string | CronExpressions, opts?: ExpressionSchedulerOptions)`

Schedules a method to run based on a cron expression.

```typescript
import { Chronos, CronExpressions } from "chronos";

const chronos = new Chronos();

class TaskService {
  @chronos.Scheduler(CronExpressions.EVERY_SECOND)
  run() {
    console.log("Running every second");
  }
}

new TaskService();
```

### `@Timeout(timeout: number, opts?: TimeoutOptions)`

Schedules a method to run once after a specified timeout (in milliseconds).

```typescript
class TaskService {
  @chronos.Timeout(5000)
  delayedTask() {
    console.log("Executed after 5 seconds");
  }
}
```

### `@OneShot(moment: Date, opts?: OneShotOptions)`

Schedules a method to run once at a specific date and time.

```typescript
class TaskService {
  @chronos.OneShot(new Date(Date.now() + 10000))
  futureTask() {
    console.log("Executed after 10 seconds");
  }
}
```

### `@Every(frequency: number, opts?: RecurrenceOptions)`

Schedules a method to run repeatedly at a fixed interval (in milliseconds).

```typescript
class TaskService {
  @chronos.Every(3000)
  repeatTask() {
    console.log("Running every 3 seconds");
  }
}
```

...

## Summary

Chronyx provides a powerful and flexible API for managing scheduled tasks using cron expressions, one-shot executions, and recurring intervals. With support for logging, introspection, and advanced options like timezones and debugging, it is a robust solution for task scheduling needs.

import rollbar, { LogArgument } from 'rollbar';

let rollbarInstance: undefined | rollbar;
export function setRollbarInstance(instance: rollbar) {
  rollbarInstance = instance;
}

export function logError(...args: LogArgument[]) {
  if (process.env.NODE_ENV === 'production' && rollbarInstance !== undefined) {
    rollbarInstance.error(...args);
  } else {
    console.error(...args);
  }
}

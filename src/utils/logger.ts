/**
 * Standardized JSON Logger for Cloud Logging compatibility.
 */
export const logger = {
  info: (message: string, context?: object) => {
    console.log(JSON.stringify({ severity: 'INFO', message, ...context, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, context?: object) => {
    console.warn(JSON.stringify({ severity: 'WARNING', message, ...context, timestamp: new Date().toISOString() }));
  },
  error: (message: string, context?: object) => {
    console.error(JSON.stringify({ severity: 'ERROR', message, ...context, timestamp: new Date().toISOString() }));
  }
};

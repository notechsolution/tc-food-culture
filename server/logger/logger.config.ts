import winston from 'winston';
import jsonStringify from 'safe-stable-stringify';

const defaultLabel = 'food_culture';
const env = process.env.NODE_ENV;

function getFormatter(labelString = defaultLabel) {
  const { format } = winston;
  const { combine, errors, json, timestamp, colorize, label, printf, splat, simple, ms, prettyPrint } = format;
  let formatter;
  if (env !== 'development' && env !== 'test') {
    formatter = combine(
      timestamp(),
      errors({ stack: true }),
      label({ label: labelString }),
      splat(),
      json()
    );
  } else {
    formatter = combine(
      colorize(),
      timestamp(),
      errors({ stack: true }),
      label({ label: labelString }),
      splat(),
      simple(),
      prettyPrint(),
      printf(function (info) {
        if (info.message && typeof info.message !== 'string') {
          info.message = jsonStringify(info.message);
        }
        if (info.stack) {
          return `${info.timestamp} ${info.level} --- [${info.label}] ${info.message} ${info.stack}`;
        }
        const stringifiedRest = jsonStringify(Object.assign({}, info, {
          level: undefined,
          message: undefined,
          splat: undefined,
          label: undefined,
          timestamp: undefined
        }));
        if (stringifiedRest !== '{}') {
          return `${info.timestamp} ${info.level} --- [${info.label}] ${info.message} ${stringifiedRest}`;
        } else {
          return `${info.timestamp} ${info.level} --- [${info.label}] ${info.message}`;
        }
      }));
  }
  return formatter;
}

function getLoggerConfig() {
  let logLevel = process.env.LOG_LEVEL;
  if (env !== 'development' && env !== 'test') {
    if (!logLevel) {
      logLevel = 'info';
    }
  } else {
    if (!logLevel) {
      logLevel = 'silly';
    }
  }
  const consoleTransport = new winston.transports.Console({ stderrLevels: ['error'], consoleWarnLevels: ['warn'] });


  return {
    level: logLevel,
    format: getFormatter(),
    transports: [
      consoleTransport
    ]
  };
}

export default {
  ...getLoggerConfig()
};

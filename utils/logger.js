const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, colorize } = format;

const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message} -- ${timestamp}`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "app.log" }),
  ],
});

// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     transports.Console({ format: format.simple() })
//   );
// }

module.exports = logger;

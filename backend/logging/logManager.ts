const winston = require('winston');

// const logConfiguration = {
//   'transports': [
//       new winston.transports.Console(),
//       new winston.transports.File({
//         filename: 'logs/mainLog.txt'
//       })
//   ]
// };

// const slogConfiguration = {
//   'transports': [
//       new winston.transports.Console(),
//       new winston.transports.File({
//         filename: 'logs/socketMessages.txt'
//       })
//   ]
// };

// const slogger = winston.createLogger(slogConfiguration);
// const logger = winston.createLogger(logConfiguration);

const initiateLogger = () => {
};

export {
  initiateLogger,
};
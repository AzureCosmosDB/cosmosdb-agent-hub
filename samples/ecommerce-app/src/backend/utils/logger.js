/**
 * Logger utility with different log levels
 */
class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    
    this.currentLevel = this.levels[process.env.LOG_LEVEL || 'info'];
  }
  
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const formatted = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    };
    
    return JSON.stringify(formatted);
  }
  
  error(message, meta = {}) {
    if (this.currentLevel >= this.levels.error) {
      console.error(this.formatMessage('error', message, meta));
    }
  }
  
  warn(message, meta = {}) {
    if (this.currentLevel >= this.levels.warn) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }
  
  info(message, meta = {}) {
    if (this.currentLevel >= this.levels.info) {
      console.log(this.formatMessage('info', message, meta));
    }
  }
  
  debug(message, meta = {}) {
    if (this.currentLevel >= this.levels.debug) {
      console.log(this.formatMessage('debug', message, meta));
    }
  }
}

const logger = new Logger();

module.exports = { logger };
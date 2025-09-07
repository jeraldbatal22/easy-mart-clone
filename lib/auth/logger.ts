// Simple logging utility for auth operations
// In production, consider using a proper logging service like Winston, Pino, or CloudWatch

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatLog(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...metadata,
    };
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    const logEntry = this.formatLog(level, message, metadata);
    
    if (this.isDevelopment) {
      console.log(JSON.stringify(logEntry, null, 2));
    } else {
      // In production, send to your logging service
      console.log(JSON.stringify(logEntry));
    }
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.WARN, message, metadata);
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.INFO, message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, metadata);
    }
  }

  // Auth-specific logging methods
  authAttempt(identifier: string, action: string, success: boolean, metadata?: Record<string, any>) {
    this.info(`Auth ${action} attempt`, {
      identifier: this.maskIdentifier(identifier),
      action,
      success,
      ...metadata,
    });
  }

  authSuccess(identifier: string, action: string, userId?: string, metadata?: Record<string, any>) {
    this.info(`Auth ${action} success`, {
      identifier: this.maskIdentifier(identifier),
      action,
      userId,
      ...metadata,
    });
  }

  authFailure(identifier: string, action: string, reason: string, metadata?: Record<string, any>) {
    this.warn(`Auth ${action} failure`, {
      identifier: this.maskIdentifier(identifier),
      action,
      reason,
      ...metadata,
    });
  }

  rateLimitExceeded(identifier: string, action: string, metadata?: Record<string, any>) {
    this.warn(`Rate limit exceeded for ${action}`, {
      identifier: this.maskIdentifier(identifier),
      action,
      ...metadata,
    });
  }

  private maskIdentifier(identifier: string): string {
    if (identifier.includes("@")) {
      // Email: mask everything except first 2 chars and domain
      const [local, domain] = identifier.split("@");
      const maskedLocal = local.length > 2 
        ? local.substring(0, 2) + "*".repeat(local.length - 2)
        : "*".repeat(local.length);
      return `${maskedLocal}@${domain}`;
    } else {
      // Phone: mask middle digits
      if (identifier.length > 4) {
        const start = identifier.substring(0, 2);
        const end = identifier.substring(identifier.length - 2);
        const middle = "*".repeat(identifier.length - 4);
        return `${start}${middle}${end}`;
      }
      return "*".repeat(identifier.length);
    }
  }
}

export const logger = new Logger();

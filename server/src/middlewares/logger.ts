import { NextFunction, Request, Response } from 'express';
import { typeValidation } from '../../types';

// Enhanced logger middleware with request/response tracking
export const loggerMiddleware: typeValidation<{}, {}> = async (
  req,
  res,
  next
) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const requestId = generateRequestId();

  // Add request ID to headers for tracking
  req.headers['x-request-id'] = requestId;

  // Log incoming request
  console.log(
    `[${timestamp}] [${requestId}] 📥 ${req.method} ${req.originalUrl}`,
    {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      headers: sanitizeHeaders(req.headers),
      body: sanitizeBody(req.body),
      query: req.query,
    }
  );

  // Capture original res.json to log responses
  const originalJson = res.json;
  res.json = function (body: any) {
    const duration = Date.now() - startTime;
    const responseTimestamp = new Date().toISOString();

    // Log response
    console.log(
      `[${responseTimestamp}] [${requestId}] 📤 ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`,
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        responseSize: JSON.stringify(body).length,
        response: sanitizeResponse(body),
      }
    );

    // Call original json method
    return originalJson.call(this, body);
  };

  // Handle errors and completion
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (res.statusCode >= 400) {
      console.error(
        `[${new Date().toISOString()}] [${requestId}] ❌ ${req.method} ${
          req.originalUrl
        } - ${res.statusCode} (${duration}ms)`
      );
    } else {
      console.log(
        `[${new Date().toISOString()}] [${requestId}] ✅ ${req.method} ${
          req.originalUrl
        } - ${res.statusCode} (${duration}ms)`
      );
    }
  });

  next();
};

// Error logging middleware
export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const requestId = req.headers['x-request-id'] || 'unknown';

  console.error(`[${timestamp}] [${requestId}] 🚨 ERROR:`, {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
  });

  next(err);
};

// Utility functions
function generateRequestId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function sanitizeHeaders(headers: any): any {
  const sanitized = { ...headers };
  // Remove sensitive headers
  delete sanitized.authorization;
  delete sanitized.cookie;
  delete sanitized['x-api-key'];
  return sanitized;
}

function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') return body;

  const sanitized = { ...body };
  // Remove sensitive fields
  if (sanitized.password) sanitized.password = '[REDACTED]';
  if (sanitized.token) sanitized.token = '[REDACTED]';
  if (sanitized.secret) sanitized.secret = '[REDACTED]';

  return sanitized;
}

function sanitizeResponse(response: any): any {
  if (!response || typeof response !== 'object') return response;

  const sanitized = { ...response };
  // Truncate large responses
  const responseStr = JSON.stringify(sanitized);
  if (responseStr.length > 1000) {
    return { message: 'Response too large to log', size: responseStr.length };
  }

  return sanitized;
}

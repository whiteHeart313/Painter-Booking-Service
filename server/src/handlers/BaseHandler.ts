import { Request, Response } from 'express';
import { ServiceResult } from '../../types';

export abstract class BaseHandler {
  protected sendResponse<T>(res: Response, result: ServiceResult<T>): void {
    if (result.success) {
      res.status(result.status || 200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(result.status || 400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  }

  protected handleError(res: Response, error: Error): void {
    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : error.message,
    });
  }
}

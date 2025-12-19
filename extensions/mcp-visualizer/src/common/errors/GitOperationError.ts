export type GitErrorType = 'Conflict' | 'Network' | 'Unknown';

export class GitOperationError extends Error {
  public readonly type: GitErrorType;
  public readonly originalError: any;

  constructor(message: string, type: GitErrorType = 'Unknown', originalError?: any) {
    super(message);
    this.name = 'GitOperationError';
    this.type = type;
    this.originalError = originalError;
    
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GitOperationError);
    }
  }
}

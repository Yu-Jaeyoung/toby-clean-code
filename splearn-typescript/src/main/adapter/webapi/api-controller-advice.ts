import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";
import {
  DuplicateEmailException,
  DuplicateProfileException,
} from "@src/common/exception/exceptions";

type ProblemDetail = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
  exception: string;
};

@Catch()
export class ApiControllerAdviceFilter implements ExceptionFilter {
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isConflict =
      exception instanceof DuplicateEmailException
      || exception instanceof DuplicateProfileException;

    const status = isConflict
      ? HttpStatus.CONFLICT
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const detail =
      exception instanceof Error ? exception.message : "Internal Server Error";

    const problem: ProblemDetail = {
      type: "about:blank",
      title: this.getTitle(status),
      status,
      detail,
      instance: request.url,
      timestamp: new Date().toISOString(),
      exception:
        exception instanceof Error ? exception.constructor.name : "UnknownError",
    };

    response.status(status)
            .json(problem);
  }

  private getTitle(status: HttpStatus): string {
    if (status === HttpStatus.CONFLICT) {
      return "Conflict";
    }

    return "Internal Server Error";
  }
}
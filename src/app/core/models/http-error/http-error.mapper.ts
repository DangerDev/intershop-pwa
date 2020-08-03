import { HttpErrorResponse } from '@angular/common/http';

import { HttpError } from './http-error.model';

// tslint:disable:ban-types

interface SpecialCallHandler {
  test(error: HttpErrorResponse): boolean;
  map(error: HttpErrorResponse): Partial<HttpError>;
}

const updatePasswordMapper: SpecialCallHandler = {
  test: error => error.url?.endsWith('/security/password'),
  map: error => {
    switch (error.headers['error-missing-attributes'] || error.headers['error-invalid-attributes']) {
      case 'secureCode':
        return { code: 'account.forgotdata.consumer_invalid_hash.error' };
      case 'userID':
        return { code: 'account.forgotdata.consumer_disabled.error' };
      case 'password':
        return { code: 'customer.credentials.passwordreset.invalid_password.error.PasswordExpressionViolation' };
      default:
        return { code: 'account.forgotdata.consumer_password_timeout.error' };
    }
  },
};

export class HttpErrorMapper {
  static fromError(httpError: HttpErrorResponse): HttpError {
    if (updatePasswordMapper.test(httpError)) {
      return { name: 'HttpErrorResponse', status: httpError.status, ...updatePasswordMapper.map(httpError) };
    }
    if (httpError.headers?.get('error-key')) {
      return {
        name: 'HttpErrorResponse',
        status: httpError.status,
        code: httpError.headers.get('error-key'),
      };
    }
    if (typeof httpError.error === 'string') {
      return {
        name: 'HttpErrorResponse',
        status: httpError.status,
        message: httpError.error,
      };
    }

    if (typeof httpError.error === 'object') {
      const errors: {
        code: string;
        message: string;
        causes?: {
          code: string;
          message: string;
          paths: string[];
        }[];
      }[] = httpError.error.errors;
      if (errors?.length) {
        if (errors.length > 1) {
          console.warn('ignoring errors' + JSON.stringify(errors.slice(1)));
        }
        const error = errors[0];
        if (error.causes?.length) {
          return {
            name: 'HttpErrorResponse',
            message: [error.message].concat(...error.causes.map(c => c.message)).join(' '),
            status: httpError.status,
          };
        }
        return {
          name: 'HttpErrorResponse',
          message: error.message,
          status: httpError.status,
        };
      }
    }

    console.warn('could not map', httpError);
    return httpError;
  }
}

import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { HttpErrorMapper } from './http-error.mapper';

describe('Http Error Mapper', () => {
  it('should convert text responses to simplified format', () => {
    expect(HttpErrorMapper.fromError(new HttpErrorResponse({ status: 401, error: 'Unauthorized' })))
      .toMatchInlineSnapshot(`
      Object {
        "message": "Unauthorized",
        "name": "HttpErrorResponse",
        "status": 401,
      }
    `);
  });

  it('should convert ICM errors format with cause to simplified format concatenating all causes', () => {
    expect(
      HttpErrorMapper.fromError(
        new HttpErrorResponse({
          status: 422,
          error: {
            errors: [
              {
                causes: [
                  {
                    code: 'basket.promotion_code.add_code_promotion_code_not_found.error',
                    message: 'The promotion code could not be found.',
                    paths: ['$.code'],
                  },
                  {
                    code: 'some.other.error',
                    message: 'Some other error.',
                    paths: ['$.code'],
                  },
                ],
                code: 'basket.promotion_code.add_not_successful.error',
                message: 'The promotion code could not be added.',
                status: '422',
              },
            ],
          },
        })
      )
    ).toMatchInlineSnapshot(`
      Object {
        "message": "The promotion code could not be added. The promotion code could not be found. Some other error.",
        "name": "HttpErrorResponse",
        "status": 422,
      }
    `);
  });

  it('should convert ICM errors format to simplified format', () => {
    expect(
      HttpErrorMapper.fromError(
        new HttpErrorResponse({
          status: 422,
          error: {
            errors: [
              {
                code: 'basket.add_line_item_not_successful.error',
                message: 'The product could not be added to your cart.',
                paths: ['$[0]'],
                status: '422',
              },
            ],
          },
        })
      )
    ).toMatchInlineSnapshot(`
      Object {
        "message": "The product could not be added to your cart.",
        "name": "HttpErrorResponse",
        "status": 422,
      }
    `);
  });

  it('should convert error-key header responses to simplified format', () => {
    expect(
      HttpErrorMapper.fromError(
        new HttpErrorResponse({
          status: 409,
          error: 'Conflict (Login name is not unique (it already exists))',
          headers: new HttpHeaders().set('error-key', 'customer.credentials.login.not_unique.error'),
        })
      )
    ).toMatchInlineSnapshot(`
      Object {
        "code": "customer.credentials.login.not_unique.error",
        "name": "HttpErrorResponse",
        "status": 409,
      }
    `);
  });

  it('should map special update password errors to matching codes', () => {
    expect(
      HttpErrorMapper.fromError(
        new HttpErrorResponse({
          status: 400,
          url: 'http://example.com/security/password',
          headers: new HttpHeaders().set('error-missing-key', 'password'),
        })
      )
    ).toMatchInlineSnapshot(`
      Object {
        "code": "account.forgotdata.consumer_password_timeout.error",
        "name": "HttpErrorResponse",
        "status": 400,
      }
    `);
  });
});

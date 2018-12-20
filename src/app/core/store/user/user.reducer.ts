import { Customer } from '../../models/customer/customer.model';
import { HttpError } from '../../models/http-error/http-error.model';
import { User } from '../../models/user/user.model';

import { UserAction, UserActionTypes } from './user.actions';

export interface UserState {
  customer: Customer;
  user: User;
  authorized: boolean;
  _authToken: string;
  error: HttpError;
}

export const initialState: UserState = {
  customer: undefined,
  user: undefined,
  authorized: false,
  _authToken: undefined,
  error: undefined,
};

export function userReducer(state = initialState, action: UserAction): UserState {
  switch (action.type) {
    case UserActionTypes.UserErrorReset: {
      return {
        ...state,
        error: undefined,
      };
    }

    case UserActionTypes.LoginUser:
    case UserActionTypes.LogoutUser: {
      return initialState;
    }

    case UserActionTypes.CreateUserFail: {
      return { ...initialState, error: action.payload };
    }

    case UserActionTypes.SetAPIToken: {
      return {
        ...state,
        _authToken: action.payload,
      };
    }

    case UserActionTypes.LoginUserFail:
    case UserActionTypes.LoadCompanyUserFail: {
      const error = action.payload;

      return {
        ...initialState,
        error,
      };
    }

    case UserActionTypes.LoginUserSuccess: {
      const payload = action.payload;
      let newState;

      newState = {
        ...state,
        authorized: true,
        customer: payload,
      };

      if (payload.type === 'PrivateCustomer') {
        newState.user = payload;
      }

      return newState;
    }

    case UserActionTypes.LoadCompanyUserSuccess: {
      const payload = action.payload;

      return {
        ...state,
        user: payload,
      };
    }
  }

  return state;
}

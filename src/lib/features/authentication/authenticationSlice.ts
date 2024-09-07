import { AUTH_TOKEN_COOKIE_KEY } from "@/lib/constants";
import { createAppSlice } from "@/lib/createAppSlice";
import { setCookie, destroyCookie } from "nookies";

type LoginPayload = {
  email: string;
  password: string;
};

type SignInPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
};

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
};

export interface AuthenticationSliceState {
  user: UserInfo | null;
  isLoggedIn: boolean;
}

const initialState: AuthenticationSliceState = {
  user: null,
  isLoggedIn: false,
};

export const authenticationSlice = createAppSlice({
  name: "authentication",
  initialState,
  reducers: (create) => ({
    signIn: create.asyncThunk(
      async (payload: SignInPayload) => {
        const response = await new Promise<UserInfo & { token: string }>(
          (resolve) => {
            setTimeout(() => {
              resolve({
                firstName: "John",
                lastName: "Doe",
                email: payload.email,
                country: "US",
                token: "1234",
              });
            }, 3000);
          }
        );

        setCookie(null, AUTH_TOKEN_COOKIE_KEY, response.token, {
          maxAge: 30 * 24 * 60 * 60,
        });

        delete (response as { token?: string }).token;

        return response as UserInfo;
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = true;
          state.user = action.payload;
        },
      }
    ),
    login: create.asyncThunk(
      async (payload: LoginPayload) => {
        console.log("login: create.asyncThunk", payload);
        const response = await new Promise<UserInfo & { token: string }>(
          (resolve) => {
            setTimeout(() => {
              resolve({
                firstName: "John",
                lastName: "Doe",
                email: payload.email,
                country: "US",
                token: "1234",
              });
            }, 1000);
          }
        );

        setCookie(null, AUTH_TOKEN_COOKIE_KEY, response.token, {
          maxAge: 30 * 24 * 60 * 60,
        });

        delete (response as { token?: string }).token;

        return response as UserInfo;
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = true;
          state.user = action.payload;
        },
      }
    ),
    logout: create.reducer((state) => {
      destroyCookie(null, AUTH_TOKEN_COOKIE_KEY);
      state.isLoggedIn = false;
      state.user = null;
    }),
  }),
  selectors: {
    selectUser: (state) => state.user,
  },
});

// Action creators are generated for each case reducer function.
export const { login, logout, signIn } = authenticationSlice.actions;

export const { selectUser } = authenticationSlice.selectors;

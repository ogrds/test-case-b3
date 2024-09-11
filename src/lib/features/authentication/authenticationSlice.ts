/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  getUniqueUserByEmail,
  saveUserToLocalStorage,
} from "@/helpers/storage";
import { AUTH_TOKEN_COOKIE_KEY } from "@/lib/constants";
import { createAppSlice } from "@/lib/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { setCookie, destroyCookie, parseCookies } from "nookies";

type LoginPayload = {
  email: string;
  password: string;
};

type SignInPayload = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
};

type UserPreferences = {
  theme: string;
};

export type UserWithPreferences = SignInPayload & {
  preferences?: UserPreferences;
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
        const response = await new Promise<UserInfo>((resolve, reject) => {
          const user = getUniqueUserByEmail(payload.email);

          setTimeout(() => {
            if (user) return reject("Usuário já cadastrado");

            saveUserToLocalStorage(payload);
            resolve({
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              country: payload.country,
            });
          }, 1000);
        });

        setCookie(null, AUTH_TOKEN_COOKIE_KEY, response.email, {
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
        rejected: (_, action) => {
          throw new Error(action.error.message);
        },
      }
    ),
    login: create.asyncThunk(
      async (payload: LoginPayload) => {
        const response = await new Promise<UserInfo>((resolve, reject) => {
          const user = getUniqueUserByEmail(payload.email);

          setTimeout(() => {
            if (!user || user.password !== payload.password)
              return reject("Usuário ou senha incorretos");

            resolve({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              country: user.country,
            });
          }, 1000);
        });

        setCookie(null, AUTH_TOKEN_COOKIE_KEY, response.email, {
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
        rejected: (_, action) => {
          throw new Error(action.error.message);
        },
      }
    ),
    logout: create.reducer((state) => {
      destroyCookie(null, AUTH_TOKEN_COOKIE_KEY);
      state.isLoggedIn = false;
      state.user = null;
    }),
    currentUser: create.asyncThunk(
      async () => {
        const response = await new Promise<UserInfo | null>((resolve) => {
          const token = parseCookies(null)?.[AUTH_TOKEN_COOKIE_KEY];

          if (!token) resolve(null);

          setTimeout(() => {
            const user = getUniqueUserByEmail(token);

            if (!user) return resolve(null);

            resolve({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              country: user.country,
            });
          }, 1000);
        });

        return response;
      },
      {
        fulfilled: (state, action) => {
          if (action.payload === null) {
            state.isLoggedIn = false;
            state.user = null;
          } else {
            state.isLoggedIn = true;
            state.user = action.payload;
          }
        },
      }
    ),
    updateProfile: create.asyncThunk(
      async (user: UserInfo) => {
        const response = await new Promise<UserInfo>((resolve, reject) => {
          const currentUser = getUniqueUserByEmail(user.email);

          if (!currentUser) return reject("Usuário não encontrado");

          saveUserToLocalStorage({
            ...currentUser,
            country: user.country,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          });

          setTimeout(() => {
            if (!currentUser)
              return reject(new Error("Usuário não encontrado"));

            resolve(user);
          }, 1000);
        });

        return response;
      },
      {
        fulfilled: (state, action) => {
          state.user = action.payload;
        },
        rejected: () => {
          throw new Error("Erro ao atualizar perfil");
        },
      }
    ),
    updatePassword: create.asyncThunk(
      async (user: { email: string; password: string }) => {
        await new Promise<void>((resolve, reject) => {
          const currentUser = getUniqueUserByEmail(user.email);

          if (!currentUser) return reject(new Error("Usuário não encontrado"));

          saveUserToLocalStorage({
            ...currentUser,
            password: user.password,
          });

          setTimeout(() => {
            if (!currentUser)
              return reject(new Error("Usuário não encontrado"));

            resolve();
          }, 1000);
        });
      }
    ),
    changeTheme: create.reducer((state, action: PayloadAction<string>) => {
      if (!state.user) return;

      const user = getUniqueUserByEmail(state.user.email);

      if (!user) return;

      const updatedUser = {
        ...user,
        preferences: {
          theme: action.payload,
        },
      };

      saveUserToLocalStorage(updatedUser);
    }),
  }),
  selectors: {
    selectUser: (state) => state.user,
    selectUserTheme: (state) => {
      const defaultTheme = "system";

      if (!state.user) return defaultTheme;

      const user = getUniqueUserByEmail(state.user.email);

      if (!user?.preferences) return defaultTheme;

      return user.preferences.theme;
    },
  },
});

// Action creators are generated for each case reducer function.
export const {
  login,
  logout,
  signIn,
  currentUser,
  updateProfile,
  changeTheme,
  updatePassword,
} = authenticationSlice.actions;

export const { selectUser, selectUserTheme } = authenticationSlice.selectors;

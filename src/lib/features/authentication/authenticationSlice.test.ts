import { configureStore } from "@reduxjs/toolkit";
import {
  authenticationSlice,
  login,
  logout,
  signIn,
  currentUser,
  updateProfile,
  changeTheme,
  updatePassword,
} from "./authenticationSlice";
import {
  getUniqueUserByEmail,
  saveUserToLocalStorage,
} from "@/helpers/storage";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { AUTH_TOKEN_COOKIE_KEY } from "@/lib/constants";

jest.mock("@/helpers/storage");
jest.mock("nookies");

const mockStore = configureStore({
  reducer: {
    authentication: authenticationSlice.reducer,
  },
});

describe("src/lib/features/authentication/authenticationSlice.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers(); // Ativa os timers fake do Jest
  });

  afterAll(() => {
    jest.useRealTimers(); // Retorna aos timers reais após o teste
  });

  it("should handle signIn fulfilled", async () => {
    const payload = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
      password: "password123",
    };

    (getUniqueUserByEmail as jest.Mock).mockReturnValue(null);
    (saveUserToLocalStorage as jest.Mock).mockImplementation(() => {});
    (setCookie as jest.Mock).mockImplementation(() => {});

    const promise = mockStore.dispatch(signIn(payload));
    jest.advanceTimersByTime(1000);
    await promise;

    const state = mockStore.getState().authentication;
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
    });
  });

  it("should handle login fulfilled", async () => {
    const payload = {
      email: "john.doe@example.com",
      password: "password123",
    };

    (getUniqueUserByEmail as jest.Mock).mockReturnValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
      password: "password123",
    });
    (setCookie as jest.Mock).mockImplementation(() => {});

    const promise = mockStore.dispatch(login(payload));
    jest.advanceTimersByTime(1000);
    await promise;

    const state = mockStore.getState().authentication;
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
    });
  });

  it("should handle logout", () => {
    mockStore.dispatch(logout());

    const state = mockStore.getState().authentication;
    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
    expect(destroyCookie).toHaveBeenCalledWith(null, AUTH_TOKEN_COOKIE_KEY);
  });

  it("should handle currentUser fulfilled", async () => {
    (parseCookies as jest.Mock).mockReturnValue({
      [AUTH_TOKEN_COOKIE_KEY]: "john.doe@example.com",
    });
    (getUniqueUserByEmail as jest.Mock).mockReturnValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
    });

    const promise = mockStore.dispatch(currentUser());
    jest.advanceTimersByTime(1000);
    await promise;

    const state = mockStore.getState().authentication;
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
    });
  });

  it("should handle updateProfile fulfilled", async () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
    };

    (getUniqueUserByEmail as jest.Mock).mockReturnValue(user);
    (saveUserToLocalStorage as jest.Mock).mockImplementation(() => {});

    const promise = mockStore.dispatch(updateProfile(user));
    jest.advanceTimersByTime(1000);
    await promise;

    const state = mockStore.getState().authentication;
    expect(state.user).toEqual(user);
  });

  it("should handle changeTheme", () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
      preferences: { theme: "light" },
    };

    (getUniqueUserByEmail as jest.Mock).mockReturnValue(user);
    (saveUserToLocalStorage as jest.Mock).mockImplementation(() => {});

    mockStore.dispatch(changeTheme("dark"));

    expect(saveUserToLocalStorage).toHaveBeenCalledWith({
      ...user,
      preferences: { theme: "dark" },
    });
  });

  it("should handle updatePassword fulfilled", async () => {
    const user = {
      email: "john.doe@example.com",
      password: "newpassword123",
    };

    (getUniqueUserByEmail as jest.Mock).mockReturnValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
      password: "oldpassword123",
    });
    (saveUserToLocalStorage as jest.Mock).mockImplementation(() => {});

    const promise = mockStore.dispatch(updatePassword(user));
    jest.advanceTimersByTime(1000);
    await promise;

    expect(saveUserToLocalStorage).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      country: "USA",
      password: "newpassword123",
    });
  });
});

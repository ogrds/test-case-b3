/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getUniqueUserByEmail, saveUserToLocalStorage } from "./storage";
import { UserWithPreferences } from "@/lib/features/authentication/authenticationSlice";

describe("src/helpers/storage.ts", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getUniqueUserByEmail", () => {
    it("should return undefined if window is undefined", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(getUniqueUserByEmail("test@example.com")).toBeUndefined();
      global.window = originalWindow;
    });

    it("should return undefined if no user is found", () => {
      localStorage.setItem("table:users", JSON.stringify([]));
      expect(getUniqueUserByEmail("test@example.com")).toBeUndefined();
    });

    it("should return the user if found", () => {
      const user = {
        email: "test@example.com",
        preferences: {},
      } as UserWithPreferences;

      localStorage.setItem("table:users", JSON.stringify([user]));
      expect(getUniqueUserByEmail("test@example.com")).toEqual(user);
    });
  });

  describe("saveUserToLocalStorage", () => {
    it("should do nothing if window is undefined", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const user = {
        email: "test@example.com",
        preferences: {},
      } as UserWithPreferences;

      saveUserToLocalStorage(user);
      global.window = originalWindow;
      expect(localStorage.getItem("table:users")).toBeNull();
    });

    it("should save a new user to localStorage", () => {
      const user = {
        email: "test@example.com",
        preferences: {},
      } as UserWithPreferences;

      saveUserToLocalStorage(user);

      const storedUsers = JSON.parse(
        localStorage.getItem("table:users") || "[]"
      );
      expect(storedUsers).toEqual([user]);
    });

    it("should update an existing user in localStorage", () => {
      const user1 = {
        email: "test1@example.com",
        preferences: {},
      } as UserWithPreferences;

      const user2 = {
        email: "test2@example.com",
        preferences: {},
      } as UserWithPreferences;

      localStorage.setItem("table:users", JSON.stringify([user1, user2]));

      const updatedUser2 = {
        email: "test2@example.com",
        preferences: { theme: "dark" },
      } as UserWithPreferences;

      saveUserToLocalStorage(updatedUser2);

      const storedUsers = JSON.parse(
        localStorage.getItem("table:users") || "[]"
      );
      expect(storedUsers).toEqual([user1, updatedUser2]);
    });
  });
});

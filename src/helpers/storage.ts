import { UserWithPreferences } from "@/lib/features/authentication/authenticationSlice";

function getUsersFromLocalStorage(): UserWithPreferences[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem("table:users");
  if (!data) return [];

  const parsedData = JSON.parse(data);

  if (!Array.isArray(parsedData)) return [];

  return parsedData;
}

export function getUniqueUserByEmail(email: string) {
  if (typeof window === "undefined") return undefined;

  const data = getUsersFromLocalStorage();

  return data?.find((user) => user.email === email);
}

export function saveUserToLocalStorage(user: UserWithPreferences) {
  if (typeof window === "undefined") return;

  const data = getUsersFromLocalStorage();

  const mapOfUsers = new Map(data.map((user) => [user.email, user]) ?? []);

  mapOfUsers.set(user.email, user);

  localStorage.setItem(
    "table:users",
    JSON.stringify(Array.from(mapOfUsers.values()))
  );
}

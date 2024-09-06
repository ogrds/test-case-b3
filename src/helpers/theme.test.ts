import { getThemeValue } from "./theme";
import { CUSTOM_THEME_PREFIX } from "@/lib/constants";
import { AvailableThemes } from "@/styles/themes";

describe("getThemeValue", () => {
  const customTheme: AvailableThemes = "customTheme";

  it("should return customTheme when theme is 'system' and systemTheme is 'light'", () => {
    const result = getThemeValue({
      theme: "system",
      systemTheme: "light",
      customTheme,
    });
    expect(result).toBe(customTheme);
  });

  it("should return 'dark__customTheme' when theme is 'system' and systemTheme is 'dark'", () => {
    const result = getThemeValue({
      theme: "system",
      systemTheme: "dark",
      customTheme,
    });
    expect(result).toBe(`dark__${customTheme}`);
  });

  it("should return 'dark__customTheme' when theme is 'dark'", () => {
    const result = getThemeValue({ theme: "dark", customTheme });
    expect(result).toBe(`dark__${customTheme}`);
  });

  it("should return customTheme when theme includes CUSTOM_THEME_PREFIX but not '__'", () => {
    const result = getThemeValue({
      theme: `${CUSTOM_THEME_PREFIX}theme`,
      customTheme,
    });
    expect(result).toBe(customTheme);
  });

  it("should return 'dark' when theme includes CUSTOM_THEME_PREFIX and '__'", () => {
    const result = getThemeValue({
      theme: `${CUSTOM_THEME_PREFIX}__theme`,
      customTheme,
    });
    expect(result).toBe("dark");
  });

  it("should return customTheme when theme is 'light'", () => {
    const result = getThemeValue({ theme: "light", customTheme });
    expect(result).toBe(customTheme);
  });
});

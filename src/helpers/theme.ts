import { CUSTOM_THEME_PREFIX } from "@/lib/constants";
import { AvailableThemes } from "@/styles/themes";

type GetThemeValueProps = {
  theme?: string;
  systemTheme?: string;
  customTheme: AvailableThemes;
};

/**
 * Retrieves the theme value based on the provided options.
 *
 * @param {GetThemeValueProps} options - The options for retrieving the theme value.
 * @returns {string} - The retrieved theme value.
 */
export function getThemeValue({
  theme = "system",
  systemTheme = "light",
  customTheme,
}: GetThemeValueProps): string {
  let defaultTheme = theme === "system" ? systemTheme : theme;

  if (defaultTheme?.includes(CUSTOM_THEME_PREFIX)) {
    if (defaultTheme.includes("__")) {
      defaultTheme = "dark";
    } else {
      defaultTheme = "light";
    }
  }

  if (defaultTheme === "light") return customTheme;

  return `${defaultTheme}__${customTheme}`;
}

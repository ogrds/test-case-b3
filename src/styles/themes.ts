import light from "./light.css";
import dark from "./dark.css";
import themeOrange from "./theme-orange.css";
import themeBlue from "./theme-blue.css";

export type AvailableThemes = keyof typeof availableThemes;

export const availableThemes = {
  light,
  dark,
  "theme-orange": {
    ...themeOrange,
    name: "Laranja",
  },
  "theme-blue": {
    ...themeBlue,
    name: "Azul",
  },
};

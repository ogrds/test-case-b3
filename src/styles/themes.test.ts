import { availableThemes, AvailableThemes } from "./themes";

describe("availableThemes", () => {
  it("should have light theme", () => {
    expect(availableThemes).toHaveProperty("light");
  });

  it("should have dark theme", () => {
    expect(availableThemes).toHaveProperty("dark");
  });

  it("should have theme-orange with correct properties", () => {
    expect(availableThemes).toHaveProperty("theme-orange");
    expect(availableThemes["theme-orange"]).toHaveProperty("name", "Laranja");
  });

  it("should have theme-blue with correct properties", () => {
    expect(availableThemes).toHaveProperty("theme-blue");
    expect(availableThemes["theme-blue"]).toHaveProperty("name", "Azul");
  });

  it("should have correct type for AvailableThemes", () => {
    const themes: AvailableThemes[] = [
      "light",
      "dark",
      "theme-orange",
      "theme-blue",
    ];
    themes.forEach((theme) => {
      expect(theme in availableThemes).toBe(true);
    });
  });
});

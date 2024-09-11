"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { availableThemes, type AvailableThemes } from "@/styles/themes";
import { CUSTOM_THEME_PREFIX } from "@/lib/constants";
import { getThemeValue } from "@/helpers/theme";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  changeTheme,
  selectUser,
  selectUserTheme,
} from "@/lib/features/authentication/authenticationSlice";

export function ModeToggle() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userTheme = useAppSelector(selectUserTheme);

  const { theme, setTheme, systemTheme } = useTheme();

  const customThemes = React.useMemo(() => {
    return Object.keys(availableThemes).filter((theme) =>
      theme.startsWith(CUSTOM_THEME_PREFIX)
    ) as AvailableThemes[];
  }, []);

  function setCustomTheme(customTheme: AvailableThemes) {
    const customThemeKey = getThemeValue({
      theme,
      systemTheme,
      customTheme,
    });

    dispatch(changeTheme(customThemeKey));
    setTheme(customThemeKey);
  }

  React.useEffect(() => {
    if (user && userTheme) {
      setTheme(userTheme);
    }
  }, [user, userTheme, setTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Cor principal</DropdownMenuLabel>
        {customThemes.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => setCustomTheme(theme)}>
            <div className="flex items-center gap-2">
              <span
                data-theme={theme}
                className="bg-primary h-5 w-5 rounded-full"
              />
              <span>{availableThemes[theme]?.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

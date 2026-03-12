"use client";

import { useEffect } from "react";
import { type CategoryTheme, themeToCSS } from "@/lib/themes";

/**
 * Inyecta las CSS variables del tema de categoría en el <body>.
 * Cuando el usuario navega entre categorías, las variables se actualizan
 * y todo el UI transiciona gracias a los transitions en globals.css.
 */
export function ThemeProvider({
  theme,
  children,
}: {
  theme: CategoryTheme;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const vars = themeToCSS(theme);
    Object.entries(vars).forEach(([key, value]) => {
      document.body.style.setProperty(key, value);
    });

    // Cleanup: restaurar valores por defecto al salir
    return () => {
      Object.keys(vars).forEach((key) => {
        document.body.style.removeProperty(key);
      });
    };
  }, [theme]);

  return <>{children}</>;
}

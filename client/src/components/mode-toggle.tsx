import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const isDark = theme === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  const isDark = theme === "dark";
  const label = isDark ? "Dark" : "Light";

  return (
    <Button
      type="button"
      variant="outline"
      size="default"
      aria-label="Toggle theme"
      onClick={cycleTheme}
    >
      {isDark ? (
        <Moon className="mr-2 h-4 w-4" />
      ) : (
        <Sun className="mr-2 h-4 w-4" />
      )}
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}

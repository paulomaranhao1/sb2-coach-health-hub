
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

interface MobileMenuHeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const MobileMenuHeader = ({ theme, toggleTheme }: MobileMenuHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-700 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold">Menu</h2>
        <Button
          onClick={toggleTheme}
          size="sm"
          variant="ghost"
          className="text-white hover:bg-gray-700"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default MobileMenuHeader;

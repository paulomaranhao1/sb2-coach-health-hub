import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}
const SectionHeader = ({
  icon: Icon,
  title,
  actionButton
}: SectionHeaderProps) => {
  return <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 px-[24px]">
          <Icon className="w-8 h-8 text-red-600" />
          <h1 className="font-bold py-0 px-0 text-2xl text-slate-950">
            {title}
          </h1>
        </div>
        {actionButton && <Button variant="outline" onClick={actionButton.onClick} size="sm" className="flex items-center gap-2 mr-6">
            {actionButton.icon && <actionButton.icon className="w-4 h-4" />}
            <span className="hidden sm:inline">{actionButton.label}</span>
          </Button>}
      </div>
    </div>;
};
export default SectionHeader;
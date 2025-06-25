
import { BarChart3, Share2 } from "lucide-react";
import SectionHeader from "@/components/layout/SectionHeader";

interface StatisticsHeaderProps {
  onShare?: () => void;
}

const StatisticsHeader = ({ onShare }: StatisticsHeaderProps) => {
  return (
    <SectionHeader 
      icon={BarChart3}
      title="Estatísticas"
      actionButton={onShare ? {
        label: "Compartilhar",
        onClick: onShare,
        icon: Share2
      } : undefined}
    />
  );
};

export default StatisticsHeader;

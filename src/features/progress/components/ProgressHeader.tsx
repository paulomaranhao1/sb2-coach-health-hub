
import { Share2, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressHeaderProps {
  hasData: boolean;
  onShare: () => void;
}

const ProgressHeader = ({ hasData, onShare }: ProgressHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-red-600">📊 Dashboard de Progresso</span>
          {hasData && (
            <div className="flex gap-2">
              <Button onClick={onShare} size="sm" variant="outline">
                <Share2 className="w-4 h-4 mr-1" />
                Compartilhar
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProgressHeader;


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Check, X } from "lucide-react";
import { toast } from "sonner";

interface RemindersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateToSupplements: () => void;
}

const RemindersModal = ({ open, onOpenChange, onNavigateToSupplements }: RemindersModalProps) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Get configured times from localStorage
  const savedTimes = localStorage.getItem('sb2_supplement_times');
  const times = savedTimes ? JSON.parse(savedTimes) : { morning: '08:00', evening: '20:00' };
  
  const reminders = [];
  
  // Check morning reminder
  if (currentHour >= 8 && currentHour < 12) {
    reminders.push({
      id: 'morning',
      time: times.morning,
      label: 'Manhã',
      description: '1 cápsula antes do café da manhã',
      isPending: true
    });
  }
  
  // Check evening reminder
  if (currentHour >= 20 || currentHour < 6) {
    reminders.push({
      id: 'evening',
      time: times.evening,
      label: 'Noite',
      description: '1 cápsula antes do jantar',
      isPending: true
    });
  }
  
  // If before 8h, both reminders are pending for the day
  if (currentHour < 8) {
    reminders.push(
      {
        id: 'morning',
        time: times.morning,
        label: 'Manhã',
        description: '1 cápsula antes do café da manhã',
        isPending: true
      },
      {
        id: 'evening',
        time: times.evening,
        label: 'Noite',
        description: '1 cápsula antes do jantar',
        isPending: true
      }
    );
  }

  const handleMarkAsTaken = (reminderId: string) => {
    const today = new Date().toDateString();
    const takenReminders = JSON.parse(localStorage.getItem('sb2_taken_reminders') || '{}');
    
    if (!takenReminders[today]) {
      takenReminders[today] = [];
    }
    
    if (!takenReminders[today].includes(reminderId)) {
      takenReminders[today].push(reminderId);
      localStorage.setItem('sb2_taken_reminders', JSON.stringify(takenReminders));
      toast.success(`Lembrete de ${reminderId === 'morning' ? 'manhã' : 'noite'} marcado como concluído!`);
    }
    
    // Close modal if no more pending reminders
    if (takenReminders[today].length >= reminders.length) {
      onOpenChange(false);
    }
  };

  const handleGoToSupplements = () => {
    onNavigateToSupplements();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="reminders-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            Lembretes SB2 TURBO
          </DialogTitle>
          <DialogDescription id="reminders-description">
            Você tem {reminders.length} lembrete{reminders.length > 1 ? 's' : ''} pendente{reminders.length > 1 ? 's' : ''} para tomar seus suplementos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">          
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{reminder.label} - {reminder.time}</h4>
                    <p className="text-xs text-muted-foreground">{reminder.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsTaken(reminder.id)}
                    className="ml-2 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleGoToSupplements}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Ir para Suplementos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemindersModal;

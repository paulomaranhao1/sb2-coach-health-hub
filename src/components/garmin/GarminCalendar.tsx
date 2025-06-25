
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const GarminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5)); // June 2025
  
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  
  const daysOfWeek = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, 1 - (startingDayOfWeek - i));
      days.push({ date: prevDate.getDate(), isCurrentMonth: false, isToday: false });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === 24; // Highlighting day 24 as shown in the reference
      days.push({ date: day, isCurrentMonth: true, isToday });
    }
    
    // Add days from next month to fill the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let day = 1; days.length < totalCells; day++) {
      days.push({ date: day, isCurrentMonth: false, isToday: false });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="garmin-card">
        <h1 className="text-2xl font-bold text-primary mb-2">Calendário</h1>
        <p className="text-secondary">Acompanhe suas atividades e planeje sua rotina</p>
      </div>

      {/* Calendar */}
      <div className="garmin-card">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-700 text-secondary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold text-primary">
            {months[currentDate.getMonth()]} de {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-700 text-secondary hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-muted py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all
                ${day.isCurrentMonth 
                  ? day.isToday 
                    ? 'bg-blue-600 text-white font-bold' 
                    : 'text-primary hover:bg-gray-700' 
                  : 'text-muted'
                }
              `}
            >
              {day.date}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Activities */}
      <div className="garmin-card">
        <h3 className="text-lg font-semibold text-primary mb-4">Atividades de Hoje</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-secondary mb-2">Nenhuma atividade planejada</p>
          <p className="text-sm text-muted">Adicione uma atividade para começar</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="garmin-card">
        <h3 className="text-lg font-semibold text-primary mb-4">Próximos Eventos</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="flex-1">
              <div className="font-medium text-primary">Desafio Weekend 10K</div>
              <div className="text-sm text-secondary">27-29 de junho</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="flex-1">
              <div className="font-medium text-primary">Meta semanal de passos</div>
              <div className="text-sm text-secondary">Renovar em 3 dias</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarminCalendar;

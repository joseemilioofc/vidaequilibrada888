import { useState } from 'react';
import { ProfessionalTemplate, DaySchedule, TimeBlock, calculateDayBalance, getCategoryLabel } from '@/types/schedule';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import BalanceIndicator from './BalanceIndicator';
import ActivityTimer from './ActivityTimer';
import { getRandomQuote } from '@/data/templates';
import { Clock, Briefcase, Heart, Moon, Plus, Edit3, Play, Timer } from 'lucide-react';

interface ScheduleViewProps {
  template: ProfessionalTemplate;
  onBlockEdit?: (block: TimeBlock) => void;
  onAddBlock?: () => void;
  selectedDay?: number;
  onDayChange?: (day: number) => void;
}

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const ScheduleView = ({ 
  template, 
  onBlockEdit, 
  onAddBlock,
  selectedDay: externalSelectedDay,
  onDayChange 
}: ScheduleViewProps) => {
  const today = new Date().getDay();
  const [internalSelectedDay, setInternalSelectedDay] = useState<number>(today);
  const [quote] = useState(getRandomQuote());
  const [activeBlock, setActiveBlock] = useState<TimeBlock | null>(null);

  const selectedDay = externalSelectedDay ?? internalSelectedDay;
  const handleDayChange = onDayChange ?? setInternalSelectedDay;

  const currentDaySchedule = template.weeklySchedule.days.find(d => d.dayOfWeek === selectedDay);
  const balance = currentDaySchedule ? calculateDayBalance(currentDaySchedule) : null;

  const handleStartActivity = (block: TimeBlock) => {
    setActiveBlock(block);
  };

  const handleStopActivity = () => {
    setActiveBlock(null);
  };

  const handleCompleteActivity = (block: TimeBlock) => {
    setActiveBlock(null);
    // Could emit event or show celebration here
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Activity Timer - Shows when an activity is active */}
      {activeBlock && (
        <ActivityTimer 
          block={activeBlock}
          onStop={handleStopActivity}
          onComplete={handleCompleteActivity}
        />
      )}

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-primary/5 via-leisure/5 to-sleep/5 border-border/30 p-4">
        <p className="text-center text-muted-foreground italic">"{quote}"</p>
      </Card>

      {/* Week Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {template.weeklySchedule.days.map((day) => (
          <button
            key={day.dayOfWeek}
            onClick={() => handleDayChange(day.dayOfWeek)}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 ${
              selectedDay === day.dayOfWeek
                ? 'bg-primary text-primary-foreground shadow-glow-work'
                : day.dayOfWeek === today
                ? 'bg-secondary border-2 border-primary/30 text-foreground'
                : 'bg-card hover:bg-secondary text-muted-foreground'
            }`}
          >
            <span className="text-xs font-medium uppercase">{dayNames[day.dayOfWeek]}</span>
            {day.theme && (
              <span className={`text-[10px] max-w-20 text-center line-clamp-1 ${
                selectedDay === day.dayOfWeek ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {day.theme}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {currentDaySchedule?.dayName}
                </h2>
                {currentDaySchedule?.theme && (
                  <Badge variant="secondary">{currentDaySchedule.theme}</Badge>
                )}
              </div>
              {onAddBlock && (
                <Button variant="outline" size="sm" onClick={onAddBlock}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              )}
            </div>

            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-2">
                {currentDaySchedule?.blocks.map((block, index) => (
                  <TimeBlockItem 
                    key={block.id} 
                    block={block} 
                    index={index}
                    onEdit={onBlockEdit}
                    onStart={handleStartActivity}
                    isActive={activeBlock?.id === block.id}
                  />
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Side Panel - Balance & Stats */}
        <div className="space-y-6">
          {/* Balance */}
          <Card className="bg-card border-border/50 p-6">
            <h3 className="font-display text-sm font-medium text-muted-foreground mb-4 text-center uppercase tracking-wider">
              Equilíbrio do Dia
            </h3>
            {balance && (
              <BalanceIndicator 
                workHours={balance.workHours} 
                leisureHours={balance.leisureHours} 
                sleepHours={balance.sleepHours}
                size="sm"
              />
            )}
          </Card>

          {/* Category Breakdown */}
          <Card className="bg-card border-border/50 p-6 space-y-4">
            <h3 className="font-display text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Distribuição de Horas
            </h3>
            
            {balance && (
              <>
                <CategoryStat 
                  icon={<Briefcase className="w-4 h-4" />}
                  label="Trabalho"
                  hours={balance.workHours}
                  category="work"
                />
                <CategoryStat 
                  icon={<Heart className="w-4 h-4" />}
                  label="Lazer/Família"
                  hours={balance.leisureHours}
                  category="leisure"
                />
                <CategoryStat 
                  icon={<Moon className="w-4 h-4" />}
                  label="Sono"
                  hours={balance.sleepHours}
                  category="sleep"
                />
              </>
            )}
          </Card>

          {/* Status Badge */}
          <Card className={`p-4 text-center ${
            balance?.isBalanced 
              ? 'bg-work/10 border-work/30' 
              : 'bg-leisure/10 border-leisure/30'
          }`}>
            <span className={`text-sm font-medium ${
              balance?.isBalanced ? 'text-work' : 'text-leisure'
            }`}>
              {balance?.isBalanced ? '✓ Dia equilibrado!' : '⚡ Adapte à sua realidade'}
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface TimeBlockItemProps {
  block: TimeBlock;
  index: number;
  onEdit?: (block: TimeBlock) => void;
  onStart?: (block: TimeBlock) => void;
  isActive?: boolean;
}

const TimeBlockItem = ({ block, index, onEdit, onStart, isActive }: TimeBlockItemProps) => {
  const categoryStyles = {
    work: 'bg-work/10 border-l-work hover:bg-work/15',
    leisure: 'bg-leisure/10 border-l-leisure hover:bg-leisure/15',
    sleep: 'bg-sleep/10 border-l-sleep hover:bg-sleep/15',
  };

  const categoryIcons = {
    work: <Briefcase className="w-4 h-4 text-work" />,
    leisure: <Heart className="w-4 h-4 text-leisure" />,
    sleep: <Moon className="w-4 h-4 text-sleep" />,
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStart?.(block);
  };

  return (
    <div 
      className={`group flex gap-4 p-4 rounded-lg border-l-4 transition-all duration-200 cursor-pointer ${categoryStyles[block.category]} ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onEdit?.(block)}
    >
      {/* Start Button */}
      {onStart && (
        <Button
          variant="ghost"
          size="icon"
          className={`flex-shrink-0 h-10 w-10 rounded-full ${
            isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary hover:bg-primary hover:text-primary-foreground'
          }`}
          onClick={handleStartClick}
          disabled={isActive}
        >
          {isActive ? <Timer className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
        </Button>
      )}

      {/* Time */}
      <div className="flex-shrink-0 w-24">
        <span className="text-sm font-medium text-foreground">{block.startTime}</span>
        <span className="text-muted-foreground"> – </span>
        <span className="text-sm text-muted-foreground">{block.endTime}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {categoryIcons[block.category]}
          <h4 className="font-medium text-foreground truncate">{block.title}</h4>
          {isActive && (
            <Badge variant="default" className="bg-primary animate-pulse">
              Em andamento
            </Badge>
          )}
        </div>
        {block.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{block.description}</p>
        )}
      </div>

      {/* Edit indicator */}
      {onEdit && !isActive && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Category Badge */}
      <Badge 
        variant="secondary" 
        className={`flex-shrink-0 text-xs ${
          block.category === 'work' ? 'badge-work' : 
          block.category === 'leisure' ? 'badge-leisure' : 'badge-sleep'
        }`}
      >
        {getCategoryLabel(block.category)}
      </Badge>
    </div>
  );
};

interface CategoryStatProps {
  icon: React.ReactNode;
  label: string;
  hours: number;
  category: 'work' | 'leisure' | 'sleep';
}

const CategoryStat = ({ icon, label, hours, category }: CategoryStatProps) => {
  const categoryColors = {
    work: 'text-work',
    leisure: 'text-leisure',
    sleep: 'text-sleep',
  };

  const barColors = {
    work: 'bg-work',
    leisure: 'bg-leisure',
    sleep: 'bg-sleep',
  };

  const percentage = (hours / 24) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${categoryColors[category]}`}>
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-semibold text-foreground">{hours}h</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${barColors[category]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ScheduleView;

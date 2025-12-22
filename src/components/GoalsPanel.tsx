import { useState } from 'react';
import { GoalSet, Goal, GoalPeriod, getGoalPeriodLabel } from '@/types/schedule';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Calendar, 
  CalendarDays, 
  CalendarRange,
  Rocket,
  Trophy,
  Star
} from 'lucide-react';

interface GoalsPanelProps {
  goals: GoalSet;
}

const periodIcons: Record<GoalPeriod, React.ReactNode> = {
  daily: <Calendar className="w-4 h-4" />,
  weekly: <CalendarDays className="w-4 h-4" />,
  monthly: <CalendarRange className="w-4 h-4" />,
  quarterly: <Target className="w-4 h-4" />,
  biannual: <Rocket className="w-4 h-4" />,
  yearly: <Trophy className="w-4 h-4" />,
  fiveYear: <Star className="w-4 h-4" />,
};

const periodColors: Record<GoalPeriod, string> = {
  daily: 'bg-work/10 border-work/30 text-work',
  weekly: 'bg-work/10 border-work/30 text-work',
  monthly: 'bg-leisure/10 border-leisure/30 text-leisure',
  quarterly: 'bg-leisure/10 border-leisure/30 text-leisure',
  biannual: 'bg-sleep/10 border-sleep/30 text-sleep',
  yearly: 'bg-sleep/10 border-sleep/30 text-sleep',
  fiveYear: 'bg-primary/10 border-primary/30 text-primary',
};

const GoalsPanel = ({ goals: initialGoals }: GoalsPanelProps) => {
  const [goals, setGoals] = useState<GoalSet>(initialGoals);

  const toggleGoal = (period: GoalPeriod, goalId: string) => {
    setGoals(prev => ({
      ...prev,
      [period]: prev[period].map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      ),
    }));
  };

  const allPeriods: GoalPeriod[] = ['daily', 'weekly', 'monthly', 'quarterly', 'biannual', 'yearly', 'fiveYear'];

  const getCompletionStats = (periodGoals: Goal[]) => {
    const completed = periodGoals.filter(g => g.completed).length;
    return { completed, total: periodGoals.length };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Metas Diárias" 
          stats={getCompletionStats(goals.daily)} 
          icon={<Calendar className="w-5 h-5 text-work" />}
        />
        <StatCard 
          label="Metas Semanais" 
          stats={getCompletionStats(goals.weekly)} 
          icon={<CalendarDays className="w-5 h-5 text-work" />}
        />
        <StatCard 
          label="Metas Mensais" 
          stats={getCompletionStats(goals.monthly)} 
          icon={<CalendarRange className="w-5 h-5 text-leisure" />}
        />
        <StatCard 
          label="Visão de Longo Prazo" 
          stats={getCompletionStats([...goals.yearly, ...goals.fiveYear])} 
          icon={<Star className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Goals by Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allPeriods.map((period) => (
          <GoalSection 
            key={period}
            period={period}
            goals={goals[period]}
            onToggle={(goalId) => toggleGoal(period, goalId)}
          />
        ))}
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  stats: { completed: number; total: number };
  icon: React.ReactNode;
}

const StatCard = ({ label, stats, icon }: StatCardProps) => {
  const percentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  
  return (
    <Card className="bg-card border-border/50 p-4">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-display font-bold text-foreground">{stats.completed}</span>
        <span className="text-muted-foreground">/ {stats.total}</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  );
};

interface GoalSectionProps {
  period: GoalPeriod;
  goals: Goal[];
  onToggle: (goalId: string) => void;
}

const GoalSection = ({ period, goals, onToggle }: GoalSectionProps) => {
  if (goals.length === 0) return null;

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-3 border-b border-border/50 flex items-center justify-between ${periodColors[period]} bg-opacity-50`}>
        <div className="flex items-center gap-2">
          {periodIcons[period]}
          <h3 className="font-display font-semibold">
            Meta {getGoalPeriodLabel(period)}
          </h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {completedCount}/{goals.length}
        </Badge>
      </div>

      {/* Goals List */}
      <div className="p-4 space-y-3">
        {goals.map((goal) => (
          <GoalItem key={goal.id} goal={goal} onToggle={() => onToggle(goal.id)} />
        ))}
      </div>
    </Card>
  );
};

interface GoalItemProps {
  goal: Goal;
  onToggle: () => void;
}

const GoalItem = ({ goal, onToggle }: GoalItemProps) => {
  return (
    <div 
      className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-secondary/50 ${
        goal.completed ? 'opacity-60' : ''
      }`}
      onClick={onToggle}
    >
      <Checkbox 
        checked={goal.completed}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {goal.title}
        </p>
        {goal.description && (
          <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
        )}
      </div>
    </div>
  );
};

export default GoalsPanel;

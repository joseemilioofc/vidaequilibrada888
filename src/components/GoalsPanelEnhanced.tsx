import { useState, useEffect } from 'react';
import { GoalSet, Goal, GoalPeriod, getGoalPeriodLabel } from '@/types/schedule';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Target, 
  Calendar, 
  CalendarDays, 
  CalendarRange,
  Rocket,
  Trophy,
  Star,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  CheckCheck
} from 'lucide-react';

type GoalStatus = 'all' | 'pending' | 'in_progress' | 'completed';

interface EnhancedGoal extends Goal {
  status: 'pending' | 'in_progress' | 'completed';
}

interface GoalsPanelEnhancedProps {
  goals: GoalSet;
  templateId: string;
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

const statusIcons = {
  pending: <Circle className="w-4 h-4 text-muted-foreground" />,
  in_progress: <Clock className="w-4 h-4 text-work" />,
  completed: <CheckCircle2 className="w-4 h-4 text-leisure" />,
};

const statusLabels = {
  all: 'Todas',
  pending: 'Pendentes',
  in_progress: 'Em Progresso',
  completed: 'Concluídas',
};

const GoalsPanelEnhanced = ({ goals: initialGoals, templateId }: GoalsPanelEnhancedProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Record<GoalPeriod, EnhancedGoal[]>>({
    daily: [],
    weekly: [],
    monthly: [],
    quarterly: [],
    biannual: [],
    yearly: [],
    fiveYear: [],
  });
  const [statusFilter, setStatusFilter] = useState<GoalStatus>('all');
  const [loading, setLoading] = useState(false);

  // Initialize goals with status
  useEffect(() => {
    const periods: GoalPeriod[] = ['daily', 'weekly', 'monthly', 'quarterly', 'biannual', 'yearly', 'fiveYear'];
    const enhanced: Record<GoalPeriod, EnhancedGoal[]> = {} as any;
    
    periods.forEach(period => {
      enhanced[period] = initialGoals[period].map(goal => ({
        ...goal,
        status: goal.completed ? 'completed' : 'pending',
      }));
    });
    
    setGoals(enhanced);
    
    // Load saved goals from database
    if (user) {
      loadSavedGoals();
    }
  }, [initialGoals, user]);

  const loadSavedGoals = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_id', templateId);

    if (data && data.length > 0) {
      setGoals(prev => {
        const updated = { ...prev };
        data.forEach(savedGoal => {
          const period = savedGoal.period as GoalPeriod;
          if (updated[period]) {
            const index = updated[period].findIndex(g => g.title === savedGoal.title);
            if (index !== -1) {
              updated[period][index] = {
                ...updated[period][index],
                completed: savedGoal.completed || false,
                status: savedGoal.completed ? 'completed' : 'pending',
              };
            }
          }
        });
        return updated;
      });
    }
  };

  const updateGoalStatus = async (period: GoalPeriod, goalId: string, status: 'pending' | 'in_progress' | 'completed') => {
    const goal = goals[period].find(g => g.id === goalId);
    if (!goal) return;

    setGoals(prev => ({
      ...prev,
      [period]: prev[period].map(g => 
        g.id === goalId ? { ...g, status, completed: status === 'completed' } : g
      ),
    }));

    if (user) {
      await supabase
        .from('goals')
        .upsert({
          user_id: user.id,
          template_id: templateId,
          title: goal.title,
          description: goal.description,
          period,
          completed: status === 'completed',
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        }, {
          onConflict: 'user_id,template_id,title'
        });

      if (status === 'completed') {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action: 'completed_goal',
          entity_type: 'goal',
          metadata: { goal_title: goal.title, period }
        });

        toast({
          title: 'Meta concluída! 🎉',
          description: goal.title,
        });
      }
    }
  };

  const markAllAsCompleted = async (period: GoalPeriod) => {
    setLoading(true);
    
    const updatedGoals = goals[period].map(g => ({
      ...g,
      status: 'completed' as const,
      completed: true,
    }));

    setGoals(prev => ({
      ...prev,
      [period]: updatedGoals,
    }));

    if (user) {
      for (const goal of updatedGoals) {
        await supabase
          .from('goals')
          .upsert({
            user_id: user.id,
            template_id: templateId,
            title: goal.title,
            description: goal.description,
            period,
            completed: true,
            completed_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,template_id,title'
          });
      }

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'completed_all_goals',
        entity_type: 'goal',
        metadata: { period, count: updatedGoals.length }
      });
    }

    toast({
      title: 'Todas as metas concluídas! 🎉',
      description: `${updatedGoals.length} metas de ${getGoalPeriodLabel(period).toLowerCase()} foram marcadas como concluídas.`,
    });

    setLoading(false);
  };

  const markAllPendingAsCompleted = async () => {
    setLoading(true);
    const periods: GoalPeriod[] = ['daily', 'weekly', 'monthly', 'quarterly', 'biannual', 'yearly', 'fiveYear'];
    let totalCompleted = 0;

    const updatedGoals = { ...goals };
    
    for (const period of periods) {
      updatedGoals[period] = goals[period].map(g => {
        if (g.status !== 'completed') {
          totalCompleted++;
          return { ...g, status: 'completed' as const, completed: true };
        }
        return g;
      });
    }

    setGoals(updatedGoals);

    if (user && totalCompleted > 0) {
      for (const period of periods) {
        for (const goal of updatedGoals[period]) {
          if (goal.completed) {
            await supabase
              .from('goals')
              .upsert({
                user_id: user.id,
                template_id: templateId,
                title: goal.title,
                description: goal.description,
                period,
                completed: true,
                completed_at: new Date().toISOString(),
              }, {
                onConflict: 'user_id,template_id,title'
              });
          }
        }
      }

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'completed_all_goals',
        entity_type: 'goal',
        metadata: { count: totalCompleted }
      });
    }

    toast({
      title: 'Todas as metas concluídas! 🎉',
      description: `${totalCompleted} metas foram marcadas como concluídas.`,
    });

    setLoading(false);
  };

  const allPeriods: GoalPeriod[] = ['daily', 'weekly', 'monthly', 'quarterly', 'biannual', 'yearly', 'fiveYear'];

  const getFilteredGoals = (periodGoals: EnhancedGoal[]) => {
    if (statusFilter === 'all') return periodGoals;
    return periodGoals.filter(g => g.status === statusFilter);
  };

  const getCompletionStats = (periodGoals: EnhancedGoal[]) => {
    const completed = periodGoals.filter(g => g.status === 'completed').length;
    return { completed, total: periodGoals.length };
  };

  const totalPending = allPeriods.reduce((acc, period) => 
    acc + goals[period].filter(g => g.status !== 'completed').length, 0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Filter and Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as GoalStatus)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {totalPending > 0 && (
          <Button 
            onClick={markAllPendingAsCompleted}
            disabled={loading}
            className="bg-work hover:bg-work/90"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Concluir Todas ({totalPending})
          </Button>
        )}
      </div>

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
        {allPeriods.map((period) => {
          const filteredGoals = getFilteredGoals(goals[period]);
          if (filteredGoals.length === 0 && statusFilter !== 'all') return null;
          
          return (
            <GoalSection 
              key={period}
              period={period}
              goals={filteredGoals}
              allGoals={goals[period]}
              onStatusChange={(goalId, status) => updateGoalStatus(period, goalId, status)}
              onMarkAllCompleted={() => markAllAsCompleted(period)}
              loading={loading}
            />
          );
        })}
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
  goals: EnhancedGoal[];
  allGoals: EnhancedGoal[];
  onStatusChange: (goalId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onMarkAllCompleted: () => void;
  loading: boolean;
}

const GoalSection = ({ period, goals, allGoals, onStatusChange, onMarkAllCompleted, loading }: GoalSectionProps) => {
  if (allGoals.length === 0) return null;

  const completedCount = allGoals.filter(g => g.status === 'completed').length;
  const pendingCount = allGoals.filter(g => g.status !== 'completed').length;

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
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{allGoals.length}
          </Badge>
          {pendingCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onMarkAllCompleted}
              disabled={loading}
              className="h-7 px-2 text-xs"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Todas
            </Button>
          )}
        </div>
      </div>

      {/* Goals List */}
      <div className="p-4 space-y-3">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <GoalItem 
              key={goal.id} 
              goal={goal} 
              onStatusChange={(status) => onStatusChange(goal.id, status)}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma meta neste filtro
          </p>
        )}
      </div>
    </Card>
  );
};

interface GoalItemProps {
  goal: EnhancedGoal;
  onStatusChange: (status: 'pending' | 'in_progress' | 'completed') => void;
}

const GoalItem = ({ goal, onStatusChange }: GoalItemProps) => {
  const cycleStatus = () => {
    const statusOrder: Array<'pending' | 'in_progress' | 'completed'> = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(goal.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(nextStatus);
  };

  return (
    <div 
      className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-secondary/50 ${
        goal.status === 'completed' ? 'opacity-60' : ''
      }`}
    >
      <button 
        onClick={cycleStatus}
        className="mt-0.5 focus:outline-none"
      >
        {statusIcons[goal.status]}
      </button>
      <div className="flex-1 min-w-0" onClick={cycleStatus}>
        <div className="flex items-center gap-2">
          <p className={`text-sm ${goal.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {goal.title}
          </p>
          <Badge 
            variant="outline" 
            className={`text-xs ${
              goal.status === 'completed' ? 'border-leisure/50 text-leisure' :
              goal.status === 'in_progress' ? 'border-work/50 text-work' :
              'border-muted-foreground/30 text-muted-foreground'
            }`}
          >
            {statusLabels[goal.status]}
          </Badge>
        </div>
        {goal.description && (
          <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
        )}
      </div>
      <Select 
        value={goal.status} 
        onValueChange={(v) => onStatusChange(v as 'pending' | 'in_progress' | 'completed')}
      >
        <SelectTrigger className="w-28 h-7 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="in_progress">Em Progresso</SelectItem>
          <SelectItem value="completed">Concluída</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GoalsPanelEnhanced;

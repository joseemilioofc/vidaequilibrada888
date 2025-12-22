import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingUp,
  Target,
  Clock,
  Calendar,
  CheckCircle2,
  Briefcase,
  Heart,
  Moon,
  Trophy,
  Flame
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DailyProgress {
  id: string;
  date: string;
  work_hours: number;
  leisure_hours: number;
  sleep_hours: number;
  tasks_completed: number;
  tasks_total: number;
}

interface GoalProgress {
  period: string;
  completed: number;
  total: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [weeklyProgress, setWeeklyProgress] = useState<DailyProgress[]>([]);
  const [goalStats, setGoalStats] = useState<GoalProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch weekly progress
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

      const { data: progressData } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      setWeeklyProgress(progressData as DailyProgress[] || []);

      // Fetch goals stats
      const { data: goalsData } = await supabase
        .from('goals')
        .select('period, completed')
        .eq('user_id', user.id);

      if (goalsData) {
        const stats: Record<string, { completed: number; total: number }> = {};
        goalsData.forEach((goal: { period: string; completed: boolean }) => {
          if (!stats[goal.period]) {
            stats[goal.period] = { completed: 0, total: 0 };
          }
          stats[goal.period].total++;
          if (goal.completed) {
            stats[goal.period].completed++;
          }
        });

        setGoalStats(
          Object.entries(stats).map(([period, data]) => ({
            period,
            ...data,
          }))
        );
      }

      // Calculate streak
      let currentStreak = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const checkDate = format(subDays(today, i), 'yyyy-MM-dd');
        const hasProgress = progressData?.some((p: DailyProgress) => p.date === checkDate);
        if (hasProgress) {
          currentStreak++;
        } else if (i > 0) {
          break;
        }
      }
      setStreak(currentStreak);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  const getProgressForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return weeklyProgress.find(p => p.date === dateStr);
  };

  const calculateWeeklyAverage = (field: 'work_hours' | 'leisure_hours' | 'sleep_hours') => {
    if (weeklyProgress.length === 0) return 0;
    const total = weeklyProgress.reduce((sum, p) => sum + (p[field] || 0), 0);
    return Math.round((total / weeklyProgress.length) * 10) / 10;
  };

  const totalGoalsCompleted = goalStats.reduce((sum, s) => sum + s.completed, 0);
  const totalGoals = goalStats.reduce((sum, s) => sum + s.total, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          label="Sequência"
          value={`${streak} dias`}
          subtext="Continue assim!"
          color="bg-orange-500/10"
        />
        <StatsCard
          icon={<Target className="w-5 h-5 text-primary" />}
          label="Metas Concluídas"
          value={`${totalGoalsCompleted}/${totalGoals}`}
          subtext={`${totalGoals > 0 ? Math.round((totalGoalsCompleted / totalGoals) * 100) : 0}% completo`}
          color="bg-primary/10"
        />
        <StatsCard
          icon={<CheckCircle2 className="w-5 h-5 text-work" />}
          label="Dias Registrados"
          value={`${weeklyProgress.length}/7`}
          subtext="Esta semana"
          color="bg-work/10"
        />
        <StatsCard
          icon={<Trophy className="w-5 h-5 text-yellow-500" />}
          label="Equilíbrio Médio"
          value={calculateWeeklyAverage('work_hours') === 8 ? '100%' : `${Math.round((calculateWeeklyAverage('work_hours') / 8) * 100)}%`}
          subtext="Do objetivo 8-8-8"
          color="bg-yellow-500/10"
        />
      </div>

      {/* Weekly Overview */}
      <Card className="bg-card border-border/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-display text-lg font-semibold text-foreground">Visão Semanal</h2>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const progress = getProgressForDay(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            const totalHours = progress 
              ? (progress.work_hours || 0) + (progress.leisure_hours || 0) + (progress.sleep_hours || 0)
              : 0;
            const completionRate = totalHours > 0 ? Math.min(100, (totalHours / 24) * 100) : 0;

            return (
              <div
                key={day.toISOString()}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  isToday ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-secondary/50'
                }`}
              >
                <span className="text-xs text-muted-foreground uppercase mb-2">
                  {format(day, 'EEE', { locale: ptBR })}
                </span>
                <span className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {format(day, 'd')}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  {progress ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hours Distribution */}
        <Card className="bg-card border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">Média de Horas</h2>
          </div>

          <div className="space-y-6">
            <HourBar
              icon={<Briefcase className="w-4 h-4" />}
              label="Trabalho"
              hours={calculateWeeklyAverage('work_hours')}
              target={8}
              color="bg-work"
              textColor="text-work"
            />
            <HourBar
              icon={<Heart className="w-4 h-4" />}
              label="Lazer/Família"
              hours={calculateWeeklyAverage('leisure_hours')}
              target={8}
              color="bg-leisure"
              textColor="text-leisure"
            />
            <HourBar
              icon={<Moon className="w-4 h-4" />}
              label="Sono"
              hours={calculateWeeklyAverage('sleep_hours')}
              target={8}
              color="bg-sleep"
              textColor="text-sleep"
            />
          </div>
        </Card>

        {/* Goals Progress */}
        <Card className="bg-card border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">Progresso das Metas</h2>
          </div>

          <ScrollArea className="h-[250px]">
            <div className="space-y-4">
              {goalStats.length > 0 ? (
                goalStats.map((stat) => (
                  <GoalProgressItem key={stat.period} {...stat} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma meta registrada ainda.
                </p>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-primary/5 via-leisure/5 to-sleep/5 border-border/30 p-6 text-center">
        <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Continue assim!
        </h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          A consistência é a chave do sucesso. Cada dia que você registra seu progresso 
          é um passo mais perto dos seus objetivos de longo prazo.
        </p>
      </Card>
    </div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}

const StatsCard = ({ icon, label, value, subtext, color }: StatsCardProps) => (
  <Card className="bg-card border-border/50 p-4">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{subtext}</p>
  </Card>
);

interface HourBarProps {
  icon: React.ReactNode;
  label: string;
  hours: number;
  target: number;
  color: string;
  textColor: string;
}

const HourBar = ({ icon, label, hours, target, color, textColor }: HourBarProps) => {
  const percentage = Math.min(100, (hours / target) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${textColor}`}>
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{hours}h</span>
          <Badge variant="secondary" className="text-xs">
            /{target}h
          </Badge>
        </div>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface GoalProgressItemProps {
  period: string;
  completed: number;
  total: number;
}

const periodLabels: Record<string, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  biannual: 'Semestral',
  yearly: 'Anual',
  fiveYear: '5 Anos',
};

const GoalProgressItem = ({ period, completed, total }: GoalProgressItemProps) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 text-sm font-medium text-muted-foreground">
        {periodLabels[period] || period}
      </div>
      <div className="flex-1">
        <Progress value={percentage} className="h-2" />
      </div>
      <div className="w-16 text-right">
        <span className="text-sm font-semibold text-foreground">{completed}/{total}</span>
      </div>
    </div>
  );
};

export default Dashboard;

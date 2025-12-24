import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Breadcrumbs from '@/components/Breadcrumbs';
import MobileNav from '@/components/MobileNav';
import {
  Users,
  Activity,
  Target,
  Calendar,
  TrendingUp,
  Clock,
  Search,
  RefreshCw,
  Moon,
  Sun,
  Home,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Heart,
  UserCheck,
  BarChart3
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  selected_template: string | null;
  created_at: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: unknown;
  created_at: string;
}

interface DailyProgressData {
  id: string;
  user_id: string;
  date: string;
  work_hours: number;
  leisure_hours: number;
  sleep_hours: number;
  tasks_completed: number;
  tasks_total: number;
}

interface GoalData {
  id: string;
  user_id: string;
  title: string;
  period: string;
  completed: boolean;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { theme, toggleTheme } = useTheme();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [allProgress, setAllProgress] = useState<DailyProgressData[]>([]);
  const [allGoals, setAllGoals] = useState<GoalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
      setupRealtimeSubscription();
    }
  }, [isAdmin]);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admin-activity')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_logs' },
        (payload) => {
          setActivities(prev => [payload.new as ActivityLog, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      setUsers(usersData || []);

      // Fetch activities
      const { data: activitiesData } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      setActivities(activitiesData || []);

      // Fetch progress
      const { data: progressData } = await supabase
        .from('daily_progress')
        .select('*')
        .order('date', { ascending: false })
        .limit(500);
      setAllProgress(progressData || []);

      // Fetch goals
      const { data: goalsData } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
      setAllGoals(goalsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = new Set(
    allProgress
      .filter(p => new Date(p.date) >= subDays(new Date(), 7))
      .map(p => p.user_id)
  ).size;
  const totalGoals = allGoals.length;
  const completedGoals = allGoals.filter(g => g.completed).length;
  const avgWorkHours = allProgress.length > 0 
    ? (allProgress.reduce((sum, p) => sum + (p.work_hours || 0), 0) / allProgress.length).toFixed(1)
    : '0';
  const avgLeisureHours = allProgress.length > 0 
    ? (allProgress.reduce((sum, p) => sum + (p.leisure_hours || 0), 0) / allProgress.length).toFixed(1)
    : '0';
  const avgSleepHours = allProgress.length > 0 
    ? (allProgress.reduce((sum, p) => sum + (p.sleep_hours || 0), 0) / allProgress.length).toFixed(1)
    : '0';

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_id.includes(searchTerm)
  );

  const filteredActivities = selectedUser === 'all' 
    ? activities 
    : activities.filter(a => a.user_id === selectedUser);

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'selected_template': 'Selecionou modelo',
      'updated_schedule': 'Atualizou cronograma',
      'completed_goal': 'Completou meta',
      'logged_progress': 'Registrou progresso',
      'login': 'Login',
      'logout': 'Logout',
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      'selected_template': 'bg-primary/20 text-primary',
      'updated_schedule': 'bg-work/20 text-work',
      'completed_goal': 'bg-leisure/20 text-leisure',
      'logged_progress': 'bg-sleep/20 text-sleep',
      'login': 'bg-green-500/20 text-green-600',
      'logout': 'bg-red-500/20 text-red-600',
    };
    return colors[action] || 'bg-muted text-muted-foreground';
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileNav isAdmin={true} />
              
              <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                  <Home className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <h1 className="font-display text-lg font-semibold text-foreground">
                    Painel de Administração
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAllData}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumbs 
          items={[
            { label: 'Início', href: '/' },
            { label: 'Administração' }
          ]} 
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard
            icon={<Users className="w-5 h-5 text-primary" />}
            label="Total Usuários"
            value={totalUsers.toString()}
            color="bg-primary/10"
          />
          <StatsCard
            icon={<UserCheck className="w-5 h-5 text-green-500" />}
            label="Ativos (7 dias)"
            value={activeUsers.toString()}
            color="bg-green-500/10"
          />
          <StatsCard
            icon={<Target className="w-5 h-5 text-leisure" />}
            label="Metas Completadas"
            value={`${completedGoals}/${totalGoals}`}
            color="bg-leisure/10"
          />
          <StatsCard
            icon={<Briefcase className="w-5 h-5 text-work" />}
            label="Média Trabalho"
            value={`${avgWorkHours}h`}
            color="bg-work/10"
          />
          <StatsCard
            icon={<Heart className="w-5 h-5 text-leisure" />}
            label="Média Lazer"
            value={`${avgLeisureHours}h`}
            color="bg-leisure/10"
          />
          <StatsCard
            icon={<Moon className="w-5 h-5 text-sleep" />}
            label="Média Sono"
            value={`${avgSleepHours}h`}
            color="bg-sleep/10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Atividades</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Metas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-card border-border/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Atividade Recente
                  </h2>
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {activities.slice(0, 10).map((activity) => {
                      const userName = users.find(u => u.user_id === activity.user_id)?.full_name || 'Usuário';
                      return (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                          <Badge className={getActionColor(activity.action)}>
                            {getActionLabel(activity.action)}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {userName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(activity.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </Card>

              {/* Tips and Suggestions */}
              <Card className="bg-card border-border/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Insights e Sugestões
                  </h2>
                </div>
                <div className="space-y-4">
                  <InsightCard 
                    type={activeUsers / totalUsers > 0.5 ? 'success' : 'warning'}
                    title="Taxa de Engajamento"
                    description={`${Math.round((activeUsers / totalUsers) * 100) || 0}% dos usuários estão ativos esta semana`}
                    suggestion={activeUsers / totalUsers < 0.5 
                      ? "Considere enviar notificações de lembrete para usuários inativos"
                      : "Excelente engajamento! Continue monitorando as métricas"
                    }
                  />
                  <InsightCard 
                    type={Number(avgSleepHours) >= 7 ? 'success' : 'warning'}
                    title="Média de Sono"
                    description={`Usuários dormem em média ${avgSleepHours} horas`}
                    suggestion={Number(avgSleepHours) < 7 
                      ? "Muitos usuários estão dormindo menos que o recomendado"
                      : "Os usuários estão mantendo bons hábitos de sono"
                    }
                  />
                  <InsightCard 
                    type={completedGoals / totalGoals > 0.3 ? 'success' : 'info'}
                    title="Conclusão de Metas"
                    description={`${Math.round((completedGoals / totalGoals) * 100) || 0}% das metas foram concluídas`}
                    suggestion="Incentive os usuários a definir metas alcançáveis"
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-card border-border/50 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {filteredUsers.map((profile) => {
                    const userProgress = allProgress.filter(p => p.user_id === profile.user_id);
                    const userGoals = allGoals.filter(g => g.user_id === profile.user_id);
                    const completedUserGoals = userGoals.filter(g => g.completed).length;
                    const lastActivity = userProgress.length > 0 
                      ? format(new Date(userProgress[0].date), "dd/MM/yyyy", { locale: ptBR })
                      : 'Nunca';

                    return (
                      <div key={profile.id} className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground">
                              {profile.full_name || 'Sem nome'}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {profile.user_id}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-semibold text-foreground">{userProgress.length}</p>
                              <p className="text-xs text-muted-foreground">Registros</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-foreground">{completedUserGoals}/{userGoals.length}</p>
                              <p className="text-xs text-muted-foreground">Metas</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-foreground">{lastActivity}</p>
                              <p className="text-xs text-muted-foreground">Última ativ.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-card border-border/50 p-6">
              <div className="flex items-center gap-4 mb-6">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Filtrar por usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os usuários</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.user_id} value={u.user_id}>
                        {u.full_name || u.user_id.slice(0, 8)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {filteredActivities.map((activity) => {
                    const userName = users.find(u => u.user_id === activity.user_id)?.full_name || 'Usuário';
                    return (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg">
                        <Badge className={getActionColor(activity.action)}>
                          {getActionLabel(activity.action)}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{userName}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.entity_type}: {JSON.stringify(activity.metadata)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(activity.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card className="bg-card border-border/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Todas as Metas
                </h2>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {allGoals.map((goal) => {
                    const userName = users.find(u => u.user_id === goal.user_id)?.full_name || 'Usuário';
                    return (
                      <div key={goal.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{goal.title}</p>
                          <p className="text-sm text-muted-foreground">{userName}</p>
                        </div>
                        <Badge variant="secondary">{goal.period}</Badge>
                        {goal.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatsCard = ({ icon, label, value, color }: StatsCardProps) => (
  <Card className="bg-card border-border/50 p-4">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-xl font-display font-bold text-foreground">{value}</p>
  </Card>
);

interface InsightCardProps {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion: string;
}

const InsightCard = ({ type, title, description, suggestion }: InsightCardProps) => {
  const colors = {
    success: 'border-green-500/30 bg-green-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    info: 'border-primary/30 bg-primary/5',
  };
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <TrendingUp className="w-5 h-5 text-primary" />,
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[type]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icons[type]}
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <p className="text-xs text-muted-foreground italic">{suggestion}</p>
    </div>
  );
};

export default Admin;
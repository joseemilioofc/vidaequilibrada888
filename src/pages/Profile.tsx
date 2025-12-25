import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Breadcrumbs from '@/components/Breadcrumbs';
import MobileNav from '@/components/MobileNav';
import { useUserRole } from '@/hooks/useUserRole';
import {
  User,
  Mail,
  Calendar,
  Save,
  ArrowLeft,
  Moon,
  Sun,
  ShieldCheck,
  Trophy,
  Target,
  Flame,
  Clock,
  Camera,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProfileData {
  full_name: string | null;
  avatar_url: string | null;
  selected_template: string | null;
}

interface Stats {
  streak: number;
  totalGoals: number;
  completedGoals: number;
  daysRegistered: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    avatar_url: '',
    selected_template: null,
  });
  const [stats, setStats] = useState<Stats>({
    streak: 0,
    totalGoals: 0,
    completedGoals: 0,
    daysRegistered: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        selected_template: data.selected_template,
      });
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!user) return;

    // Fetch goals stats
    const { data: goalsData } = await supabase
      .from('goals')
      .select('completed')
      .eq('user_id', user.id);

    // Fetch progress stats
    const { data: progressData } = await supabase
      .from('daily_progress')
      .select('date')
      .eq('user_id', user.id);

    if (goalsData) {
      setStats(prev => ({
        ...prev,
        totalGoals: goalsData.length,
        completedGoals: goalsData.filter(g => g.completed).length,
      }));
    }

    if (progressData) {
      setStats(prev => ({
        ...prev,
        daysRegistered: progressData.length,
        streak: progressData.length, // Simplified streak calculation
      }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas alterações foram salvas com sucesso.',
      });

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'profile_updated',
        entity_type: 'profile',
        metadata: { updated_fields: ['full_name', 'avatar_url'] },
      });
    }

    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = (name: string | null) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileNav isAdmin={isAdmin} />
              
              <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  Meu Perfil
                </h1>
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
              
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Início', href: '/' },
            { label: 'Perfil' },
          ]}
        />

        {/* Profile Card */}
        <Card className="bg-card border-border/50 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <Badge variant="secondary" className="mt-4">
                {isAdmin ? 'Administrador' : 'Usuário'}
              </Badge>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Nome Completo
                  </Label>
                  <Input
                    id="fullName"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Digite seu nome completo"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarUrl" className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                    URL do Avatar
                  </Label>
                  <Input
                    id="avatarUrl"
                    value={profile.avatar_url || ''}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                    placeholder="https://exemplo.com/sua-foto.jpg"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Membro desde
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.created_at
                      ? format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      : 'Data não disponível'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sair da conta
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Flame className="w-5 h-5 text-orange-500" />}
            label="Sequência"
            value={`${stats.streak} dias`}
            color="bg-orange-500/10"
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-primary" />}
            label="Metas"
            value={`${stats.completedGoals}/${stats.totalGoals}`}
            color="bg-primary/10"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-leisure" />}
            label="Dias Registrados"
            value={`${stats.daysRegistered}`}
            color="bg-leisure/10"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5 text-yellow-500" />}
            label="Conclusão"
            value={stats.totalGoals > 0 ? `${Math.round((stats.completedGoals / stats.totalGoals) * 100)}%` : '0%'}
            color="bg-yellow-500/10"
          />
        </div>

        {/* Progress Card */}
        <Card className="bg-card border-border/50 p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Seu Progresso</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Metas concluídas</span>
                <span className="font-medium">{stats.completedGoals}/{stats.totalGoals}</span>
              </div>
              <Progress
                value={stats.totalGoals > 0 ? (stats.completedGoals / stats.totalGoals) * 100 : 0}
                className="h-2"
              />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <Card className="bg-card border-border/50 p-4">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-xl font-display font-bold text-foreground">{value}</p>
  </Card>
);

export default Profile;

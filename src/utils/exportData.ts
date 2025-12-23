import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalTemplate, TimeBlock, Goal, GoalPeriod } from '@/types/schedule';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ExportData {
  exportDate: string;
  user: {
    email: string | undefined;
  };
  template: {
    id: string;
    name: string;
  } | null;
  schedules: {
    dayOfWeek: string;
    blocks: TimeBlock[];
  }[];
  goals: {
    period: GoalPeriod;
    title: string;
    completed: boolean;
  }[];
  dailyProgress: {
    date: string;
    workHours: number;
    leisureHours: number;
    sleepHours: number;
    tasksCompleted: number;
    tasksTotal: number;
    notes: string | null;
  }[];
}

export async function exportUserData(
  user: { id: string; email?: string } | null,
  selectedTemplate: ProfessionalTemplate | null
): Promise<void> {
  if (!user) {
    toast({
      title: 'Erro',
      description: 'Você precisa estar logado para exportar dados.',
      variant: 'destructive',
    });
    return;
  }

  try {
    // Fetch schedules
    const { data: schedulesData } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', user.id);

    // Fetch goals
    const { data: goalsData } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id);

    // Fetch daily progress
    const { data: progressData } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    const exportData: ExportData = {
      exportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      user: {
        email: user.email,
      },
      template: selectedTemplate ? {
        id: selectedTemplate.id,
        name: selectedTemplate.name,
      } : null,
      schedules: (schedulesData || []).map((s: any) => ({
        dayOfWeek: s.day_of_week,
        blocks: typeof s.blocks === 'string' ? JSON.parse(s.blocks) : s.blocks,
      })),
      goals: (goalsData || []).map((g: any) => ({
        period: g.period as GoalPeriod,
        title: g.title,
        completed: g.completed,
      })),
      dailyProgress: (progressData || []).map((p: any) => ({
        date: p.date,
        workHours: p.work_hours || 0,
        leisureHours: p.leisure_hours || 0,
        sleepHours: p.sleep_hours || 0,
        tasksCompleted: p.tasks_completed || 0,
        tasksTotal: p.tasks_total || 0,
        notes: p.notes,
      })),
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `equilibrio-vida-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Exportação concluída!',
      description: 'Seus dados foram exportados com sucesso.',
    });
  } catch (error) {
    console.error('Export error:', error);
    toast({
      title: 'Erro ao exportar',
      description: 'Não foi possível exportar seus dados.',
      variant: 'destructive',
    });
  }
}

export async function exportToCSV(
  user: { id: string; email?: string } | null
): Promise<void> {
  if (!user) {
    toast({
      title: 'Erro',
      description: 'Você precisa estar logado para exportar dados.',
      variant: 'destructive',
    });
    return;
  }

  try {
    const { data: progressData } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (!progressData || progressData.length === 0) {
      toast({
        title: 'Sem dados',
        description: 'Não há dados de progresso para exportar.',
      });
      return;
    }

    const headers = ['Data', 'Horas Trabalho', 'Horas Lazer', 'Horas Sono', 'Tarefas Concluídas', 'Total Tarefas', 'Notas'];
    const rows = progressData.map((p: any) => [
      p.date,
      p.work_hours || 0,
      p.leisure_hours || 0,
      p.sleep_hours || 0,
      p.tasks_completed || 0,
      p.tasks_total || 0,
      (p.notes || '').replace(/,/g, ';'),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progresso-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Exportação concluída!',
      description: 'Seus dados foram exportados em CSV.',
    });
  } catch (error) {
    console.error('Export CSV error:', error);
    toast({
      title: 'Erro ao exportar',
      description: 'Não foi possível exportar seus dados.',
      variant: 'destructive',
    });
  }
}

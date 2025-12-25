import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bell, Target, Calendar, Clock, Settings } from 'lucide-react';

interface NotificationPreferences {
  dailyReminder: boolean;
  goalProgress: boolean;
  weeklyReport: boolean;
  scheduleAlerts: boolean;
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    dailyReminder: true,
    goalProgress: true,
    weeklyReport: true,
    scheduleAlerts: true,
  });

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    // In a real app, you would save these to the database
    toast({
      title: 'Preferências salvas!',
      description: 'Suas configurações de notificação foram atualizadas.',
    });
    setIsOpen(false);
  };

  const createTestNotification = async () => {
    if (!user) return;

    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Teste de Notificação',
      message: 'Esta é uma notificação de teste para verificar se tudo está funcionando!',
      type: 'info',
    });

    toast({
      title: 'Notificação criada!',
      description: 'Verifique o painel de notificações.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Configurações de Notificação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="dailyReminder" className="font-medium">
                    Lembrete Diário
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receba lembretes para registrar seu progresso
                  </p>
                </div>
              </div>
              <Switch
                id="dailyReminder"
                checked={preferences.dailyReminder}
                onCheckedChange={() => handleToggle('dailyReminder')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-leisure/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-leisure" />
                </div>
                <div>
                  <Label htmlFor="goalProgress" className="font-medium">
                    Progresso das Metas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notificações sobre conclusão de metas
                  </p>
                </div>
              </div>
              <Switch
                id="goalProgress"
                checked={preferences.goalProgress}
                onCheckedChange={() => handleToggle('goalProgress')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-work/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-work" />
                </div>
                <div>
                  <Label htmlFor="weeklyReport" className="font-medium">
                    Relatório Semanal
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Resumo semanal do seu progresso
                  </p>
                </div>
              </div>
              <Switch
                id="weeklyReport"
                checked={preferences.weeklyReport}
                onCheckedChange={() => handleToggle('weeklyReport')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sleep/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-sleep" />
                </div>
                <div>
                  <Label htmlFor="scheduleAlerts" className="font-medium">
                    Alertas de Cronograma
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Lembretes sobre atividades agendadas
                  </p>
                </div>
              </div>
              <Switch
                id="scheduleAlerts"
                checked={preferences.scheduleAlerts}
                onCheckedChange={() => handleToggle('scheduleAlerts')}
              />
            </div>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              Salvar Preferências
            </Button>
            <Button variant="outline" onClick={createTestNotification}>
              Testar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettings;

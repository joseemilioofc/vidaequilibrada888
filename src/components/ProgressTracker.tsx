import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Heart, Moon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ProgressTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const ProgressTracker = ({ isOpen, onClose, onSaved }: ProgressTrackerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [workHours, setWorkHours] = useState(8);
  const [leisureHours, setLeisureHours] = useState(8);
  const [sleepHours, setSleepHours] = useState(8);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksTotal, setTasksTotal] = useState(5);
  const [notes, setNotes] = useState('');

  const totalHours = workHours + leisureHours + sleepHours;
  const isBalanced = workHours === 8 && leisureHours === 8 && sleepHours === 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const today = format(new Date(), 'yyyy-MM-dd');

      const { error } = await supabase
        .from('daily_progress')
        .upsert({
          user_id: user.id,
          date: today,
          work_hours: workHours,
          leisure_hours: leisureHours,
          sleep_hours: sleepHours,
          tasks_completed: tasksCompleted,
          tasks_total: tasksTotal,
          notes,
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;

      // Create a notification for the user
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Progresso registrado!',
          message: isBalanced 
            ? 'Parabéns! Você manteve o equilíbrio 8-8-8 hoje!' 
            : `Você registrou ${workHours}h trabalho, ${leisureHours}h lazer e ${sleepHours}h sono.`,
          type: isBalanced ? 'success' : 'info',
        });

      toast({
        title: 'Progresso salvo!',
        description: 'Seu progresso do dia foi registrado.',
      });

      onSaved();
      onClose();
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar seu progresso.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Registrar Progresso do Dia
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-work">
                <Briefcase className="w-4 h-4" />
                Horas de Trabalho
              </Label>
              <span className="font-semibold text-foreground">{workHours}h</span>
            </div>
            <Slider
              value={[workHours]}
              onValueChange={(v) => setWorkHours(v[0])}
              max={16}
              step={0.5}
              className="[&>span]:bg-work"
            />
          </div>

          {/* Leisure Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-leisure">
                <Heart className="w-4 h-4" />
                Horas de Lazer/Família
              </Label>
              <span className="font-semibold text-foreground">{leisureHours}h</span>
            </div>
            <Slider
              value={[leisureHours]}
              onValueChange={(v) => setLeisureHours(v[0])}
              max={16}
              step={0.5}
              className="[&>span]:bg-leisure"
            />
          </div>

          {/* Sleep Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sleep">
                <Moon className="w-4 h-4" />
                Horas de Sono
              </Label>
              <span className="font-semibold text-foreground">{sleepHours}h</span>
            </div>
            <Slider
              value={[sleepHours]}
              onValueChange={(v) => setSleepHours(v[0])}
              max={12}
              step={0.5}
              className="[&>span]:bg-sleep"
            />
          </div>

          {/* Total Hours Indicator */}
          <div className={`p-3 rounded-lg text-center ${
            totalHours === 24 
              ? 'bg-primary/10 text-primary' 
              : 'bg-destructive/10 text-destructive'
          }`}>
            <span className="text-sm font-medium">
              Total: {totalHours}h / 24h
              {totalHours !== 24 && ` (${totalHours > 24 ? '+' : ''}${totalHours - 24}h)`}
            </span>
          </div>

          {/* Tasks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tasksCompleted">Tarefas Concluídas</Label>
              <Input
                id="tasksCompleted"
                type="number"
                min={0}
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(parseInt(e.target.value) || 0)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tasksTotal">Total de Tarefas</Label>
              <Input
                id="tasksTotal"
                type="number"
                min={0}
                value={tasksTotal}
                onChange={(e) => setTasksTotal(parseInt(e.target.value) || 0)}
                className="bg-background/50"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas do dia (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi seu dia?"
              className="bg-background/50 resize-none"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Progresso'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressTracker;

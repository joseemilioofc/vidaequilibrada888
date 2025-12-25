import { useState } from 'react';
import { ProfessionalTemplate, Goal } from '@/types/schedule';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Target, Sparkles, Check } from 'lucide-react';

interface GoalGeneratorProps {
  template: ProfessionalTemplate;
  onGoalsGenerated: () => void;
}

type GoalPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'yearly' | 'fiveYear';

const periodLabels: Record<GoalPeriod, string> = {
  daily: 'Diárias',
  weekly: 'Semanais',
  monthly: 'Mensais',
  quarterly: 'Trimestrais',
  biannual: 'Semestrais',
  yearly: 'Anuais',
  fiveYear: '5 Anos',
};

const GoalGenerator = ({ template, onGoalsGenerated }: GoalGeneratorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const allGoals = Object.entries(template.goals).flatMap(([period, goals]) =>
    goals.map(goal => ({ ...goal, period: period as GoalPeriod }))
  );

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoals(prev => ({ ...prev, [goalId]: !prev[goalId] }));
  };

  const handleSelectAll = () => {
    const allSelected = allGoals.every(g => selectedGoals[g.id]);
    if (allSelected) {
      setSelectedGoals({});
    } else {
      const newSelected: Record<string, boolean> = {};
      allGoals.forEach(g => { newSelected[g.id] = true; });
      setSelectedGoals(newSelected);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    
    const goalsToCreate = allGoals.filter(g => selectedGoals[g.id]);
    if (goalsToCreate.length === 0) {
      toast({
        title: 'Selecione metas',
        description: 'Por favor, selecione pelo menos uma meta para gerar.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('goals').insert(
        goalsToCreate.map(goal => ({
          user_id: user.id,
          template_id: template.id,
          title: goal.title,
          description: goal.description || null,
          period: goal.period,
          completed: false,
        }))
      );

      if (error) throw error;

      // Create notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Metas criadas!',
        message: `${goalsToCreate.length} metas foram adicionadas ao seu plano baseado no cronograma ${template.name}.`,
        type: 'success',
      });

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'goals_generated',
        entity_type: 'goal',
        metadata: { 
          template_id: template.id, 
          goals_count: goalsToCreate.length,
          periods: [...new Set(goalsToCreate.map(g => g.period))],
        },
      });

      toast({
        title: 'Metas geradas!',
        description: `${goalsToCreate.length} metas foram criadas com sucesso.`,
      });

      onGoalsGenerated();
      setIsOpen(false);
      setSelectedGoals({});
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar as metas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = Object.values(selectedGoals).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Gerar Metas do Cronograma
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Gerar Metas - {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between py-2 border-b border-border">
          <p className="text-sm text-muted-foreground">
            {selectedCount} de {allGoals.length} metas selecionadas
          </p>
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            {selectedCount === allGoals.length ? 'Desmarcar todas' : 'Selecionar todas'}
          </Button>
        </div>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-6 py-4">
            {(Object.keys(template.goals) as GoalPeriod[]).map(period => {
              const goals = template.goals[period];
              if (!goals || goals.length === 0) return null;

              return (
                <div key={period}>
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Badge variant="secondary">{periodLabels[period]}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {goals.map(goal => (
                      <Card
                        key={goal.id}
                        className={`p-3 cursor-pointer transition-all ${
                          selectedGoals[goal.id]
                            ? 'border-primary bg-primary/5'
                            : 'border-border/50 hover:border-primary/30'
                        }`}
                        onClick={() => handleToggleGoal(goal.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedGoals[goal.id] || false}
                            onCheckedChange={() => handleToggleGoal(goal.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">
                              {goal.title}
                            </p>
                            {goal.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {goal.description}
                              </p>
                            )}
                          </div>
                          {selectedGoals[goal.id] && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleGenerate} disabled={loading || selectedCount === 0} className="gap-2">
            <Sparkles className="w-4 h-4" />
            {loading ? 'Gerando...' : `Gerar ${selectedCount} Metas`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalGenerator;

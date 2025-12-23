import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalTemplate, TimeBlock } from '@/types/schedule';
import { professionalTemplates } from '@/data/templates';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import TemplateCard from '@/components/TemplateCard';
import BalanceIndicator from '@/components/BalanceIndicator';
import ScheduleView from '@/components/ScheduleView';
import GoalsPanel from '@/components/GoalsPanel';
import Header from '@/components/Header';
import BlockEditor from '@/components/BlockEditor';
import ProgressTracker from '@/components/ProgressTracker';
import { useToast } from '@/hooks/use-toast';
import { exportUserData } from '@/utils/exportData';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState<ProfessionalTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'goals'>('schedule');
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // Load user's selected template from profile
  useEffect(() => {
    if (user) {
      loadUserTemplate();
    }
  }, [user]);

  const loadUserTemplate = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('selected_template')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile?.selected_template) {
      const template = professionalTemplates.find(t => t.id === profile.selected_template);
      if (template) {
        setSelectedTemplate({ ...template });
      }
    }
  };

  const handleSelectTemplate = async (template: ProfessionalTemplate) => {
    setSelectedTemplate({ ...template });
    
    if (user) {
      // Save to profile
      await supabase
        .from('profiles')
        .update({ selected_template: template.id })
        .eq('user_id', user.id);

      toast({
        title: 'Modelo selecionado!',
        description: `Você escolheu o modelo ${template.name}`,
      });
    }
  };

  const handleBlockEdit = (block: TimeBlock) => {
    setEditingBlock(block);
    setIsEditorOpen(true);
  };

  const handleBlockSave = (updatedBlock: TimeBlock) => {
    if (!selectedTemplate) return;

    const updatedTemplate = { ...selectedTemplate };
    const dayIndex = updatedTemplate.weeklySchedule.days.findIndex(d => d.dayOfWeek === selectedDay);
    
    if (dayIndex !== -1) {
      const blockIndex = updatedTemplate.weeklySchedule.days[dayIndex].blocks.findIndex(
        b => b.id === updatedBlock.id
      );

      if (blockIndex !== -1) {
        updatedTemplate.weeklySchedule.days[dayIndex].blocks[blockIndex] = updatedBlock;
      } else {
        updatedTemplate.weeklySchedule.days[dayIndex].blocks.push(updatedBlock);
        // Sort blocks by start time
        updatedTemplate.weeklySchedule.days[dayIndex].blocks.sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        );
      }

      setSelectedTemplate(updatedTemplate);
      saveScheduleToDatabase(dayIndex, updatedTemplate.weeklySchedule.days[dayIndex].blocks);
    }
  };

  const handleBlockDelete = (blockId: string) => {
    if (!selectedTemplate) return;

    const updatedTemplate = { ...selectedTemplate };
    const dayIndex = updatedTemplate.weeklySchedule.days.findIndex(d => d.dayOfWeek === selectedDay);
    
    if (dayIndex !== -1) {
      updatedTemplate.weeklySchedule.days[dayIndex].blocks = 
        updatedTemplate.weeklySchedule.days[dayIndex].blocks.filter(b => b.id !== blockId);
      
      setSelectedTemplate(updatedTemplate);
      saveScheduleToDatabase(dayIndex, updatedTemplate.weeklySchedule.days[dayIndex].blocks);
    }
  };

  const handleBlockDuplicate = (block: TimeBlock) => {
    const newBlock: TimeBlock = {
      ...block,
      id: crypto.randomUUID(),
      title: `${block.title} (cópia)`,
    };
    handleBlockSave(newBlock);
    toast({
      title: 'Bloco duplicado!',
      description: 'O bloco foi duplicado com sucesso.',
    });
  };

  const saveScheduleToDatabase = async (dayIndex: number, blocks: TimeBlock[]) => {
    if (!user || !selectedTemplate) return;

    const day = selectedTemplate.weeklySchedule.days[dayIndex];

    await supabase
      .from('schedules')
      .upsert({
        user_id: user.id,
        template_id: selectedTemplate.id,
        day_of_week: day.dayName,
        blocks: JSON.stringify(blocks),
      }, {
        onConflict: 'user_id,template_id,day_of_week'
      });
  };

  const handleAddBlock = () => {
    setEditingBlock(null);
    setIsEditorOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-work/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-leisure/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sleep/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <header className="text-center mb-16 animate-fade-in">
            {/* Theme Toggle for Landing */}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Sistema 8-8-8 de Vida Equilibrada
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Planeje sua vida com
              <span className="text-gradient block">equilíbrio perfeito</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-6">
              8 horas de trabalho. 8 horas de lazer. 8 horas de sono.
              <br />
              Escolha seu modelo profissional e comece agora.
            </p>

            {!user && (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => navigate('/auth')}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Criar conta grátis
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                >
                  Fazer login
                </button>
              </div>
            )}
          </header>

          {/* Balance Preview */}
          <div className="flex justify-center mb-16 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <BalanceIndicator workHours={8} leisureHours={8} sleepHours={8} />
          </div>

          {/* Template Selection */}
          <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-8 text-center">
              Escolha seu modelo profissional
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {professionalTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => handleSelectTemplate(template)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        template={selectedTemplate} 
        onBack={() => setSelectedTemplate(null)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenProgress={() => setIsProgressOpen(true)}
        onExportData={() => exportUserData(user, selectedTemplate)}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {activeTab === 'schedule' ? (
          <ScheduleView 
            template={selectedTemplate}
            onBlockEdit={handleBlockEdit}
            onAddBlock={handleAddBlock}
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
          />
        ) : (
          <GoalsPanel goals={selectedTemplate.goals} />
        )}
      </main>

      <BlockEditor
        block={editingBlock}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleBlockSave}
        onDelete={handleBlockDelete}
        onDuplicate={handleBlockDuplicate}
      />

      <ProgressTracker
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        onSaved={() => {}}
      />
    </div>
  );
};

export default Index;

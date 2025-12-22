import { useState } from 'react';
import { ProfessionalTemplate } from '@/types/schedule';
import { professionalTemplates } from '@/data/templates';
import TemplateCard from '@/components/TemplateCard';
import BalanceIndicator from '@/components/BalanceIndicator';
import ScheduleView from '@/components/ScheduleView';
import GoalsPanel from '@/components/GoalsPanel';
import Header from '@/components/Header';

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProfessionalTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'goals'>('schedule');

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Sistema 8-8-8 de Vida Equilibrada
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Planeje sua vida com
              <span className="text-gradient block">equilíbrio perfeito</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              8 horas de trabalho. 8 horas de lazer. 8 horas de sono.
              <br />
              Escolha seu modelo profissional e comece agora.
            </p>
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
                  onSelect={() => setSelectedTemplate(template)}
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
      />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {activeTab === 'schedule' ? (
          <ScheduleView template={selectedTemplate} />
        ) : (
          <GoalsPanel goals={selectedTemplate.goals} />
        )}
      </main>
    </div>
  );
};

export default Index;

import { ProfessionalTemplate } from '@/types/schedule';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Target, BarChart3 } from 'lucide-react';

interface HeaderProps {
  template: ProfessionalTemplate;
  onBack: () => void;
  activeTab: 'schedule' | 'goals';
  onTabChange: (tab: 'schedule' | 'goals') => void;
  onOpenProgress?: () => void;
}

const Header = ({ template, onBack, activeTab, onTabChange, onOpenProgress }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Left: Back button and title */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">{template.icon}</span>
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  {template.name}
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Sistema 8-8-8
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {onOpenProgress && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenProgress}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Progresso</span>
              </Button>
            )}
            
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
              <Button
                variant={activeTab === 'schedule' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('schedule')}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Cronograma</span>
              </Button>
              <Button
                variant={activeTab === 'goals' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('goals')}
                className="gap-2"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Metas</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

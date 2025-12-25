import { useState } from 'react';
import { ProfessionalTemplate } from '@/types/schedule';
import { professionalTemplates } from '@/data/templates';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, Check, ChevronRight } from 'lucide-react';

interface ScheduleSelectorProps {
  currentTemplate: ProfessionalTemplate | null;
  onSelectTemplate: (template: ProfessionalTemplate) => void;
}

const ScheduleSelector = ({ currentTemplate, onSelectTemplate }: ScheduleSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (template: ProfessionalTemplate) => {
    onSelectTemplate(template);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Trocar Cronograma
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Escolha um Cronograma
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-3">
            {professionalTemplates.map((template) => {
              const isSelected = currentTemplate?.id === template.id;
              
              return (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border/50'
                  }`}
                  onClick={() => handleSelect(template)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{template.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-foreground">
                          {template.name}
                        </h3>
                        {isSelected && (
                          <Badge variant="secondary" className="gap-1">
                            <Check className="w-3 h-3" />
                            Atual
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.focus.map((focus) => (
                          <Badge key={focus} variant="outline" className="text-xs">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleSelector;

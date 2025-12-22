import { ProfessionalTemplate } from '@/types/schedule';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TemplateCardProps {
  template: ProfessionalTemplate;
  onSelect: () => void;
}

const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden bg-card border-border/50 hover-lift cursor-pointer transition-all duration-300 hover:border-primary/30"
      onClick={onSelect}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-leisure/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Icon */}
        <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
          {template.icon}
        </div>
        
        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {template.name}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {template.description}
        </p>
        
        {/* Focus tags */}
        <div className="flex flex-wrap gap-2">
          {template.focus.map((item, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="text-xs font-medium"
            >
              {item}
            </Badge>
          ))}
        </div>
        
        {/* Select indicator */}
        <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg 
            className="w-4 h-4 text-primary" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default TemplateCard;

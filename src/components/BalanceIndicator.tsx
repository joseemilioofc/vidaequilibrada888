interface BalanceIndicatorProps {
  workHours: number;
  leisureHours: number;
  sleepHours: number;
  size?: 'sm' | 'md' | 'lg';
}

const BalanceIndicator = ({ workHours, leisureHours, sleepHours, size = 'md' }: BalanceIndicatorProps) => {
  const total = workHours + leisureHours + sleepHours;
  const workPercent = (workHours / total) * 100;
  const leisurePercent = (leisureHours / total) * 100;
  const sleepPercent = (sleepHours / total) * 100;

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const innerSizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Calculate the conic gradient stops
  const workStop = workPercent;
  const leisureStop = workPercent + leisurePercent;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Ring with gradient */}
        <div 
          className={`${sizeClasses[size]} rounded-full relative animate-spin-slow`}
          style={{
            background: `conic-gradient(
              hsl(var(--work)) 0deg ${workStop * 3.6}deg,
              hsl(var(--leisure)) ${workStop * 3.6}deg ${leisureStop * 3.6}deg,
              hsl(var(--sleep)) ${leisureStop * 3.6}deg 360deg
            )`,
          }}
        >
          {/* Inner circle */}
          <div className={`absolute inset-0 flex items-center justify-center`}>
            <div className={`${innerSizeClasses[size]} rounded-full bg-background shadow-inner flex items-center justify-center`}>
              <span className={`font-display font-bold text-foreground ${textSizeClasses[size]}`}>8-8-8</span>
            </div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10" />
      </div>

      {/* Legend */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-work" />
          <span className={`text-muted-foreground ${textSizeClasses[size]}`}>{workHours}h</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-leisure" />
          <span className={`text-muted-foreground ${textSizeClasses[size]}`}>{leisureHours}h</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sleep" />
          <span className={`text-muted-foreground ${textSizeClasses[size]}`}>{sleepHours}h</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceIndicator;

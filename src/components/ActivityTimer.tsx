import { useState, useEffect, useCallback } from 'react';
import { TimeBlock, getCategoryLabel } from '@/types/schedule';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Briefcase, 
  Heart, 
  Moon,
  Bell,
  CheckCircle
} from 'lucide-react';

interface ActivityTimerProps {
  block: TimeBlock | null;
  onStop: () => void;
  onComplete: (block: TimeBlock) => void;
}

const categoryIcons = {
  work: <Briefcase className="w-5 h-5" />,
  leisure: <Heart className="w-5 h-5" />,
  sleep: <Moon className="w-5 h-5" />,
};

const categoryColors = {
  work: 'text-work border-work/30 bg-work/10',
  leisure: 'text-leisure border-leisure/30 bg-leisure/10',
  sleep: 'text-sleep border-sleep/30 bg-sleep/10',
};

const ActivityTimer = ({ block, onStop, onComplete }: ActivityTimerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Calculate total duration in seconds
  const getTotalDuration = useCallback(() => {
    if (!block) return 0;
    const [startHour, startMin] = block.startTime.split(':').map(Number);
    const [endHour, endMin] = block.endTime.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    return (endMinutes - startMinutes) * 60;
  }, [block]);

  const totalDuration = getTotalDuration();
  const remainingSeconds = Math.max(0, totalDuration - elapsedSeconds);
  const progress = totalDuration > 0 ? (elapsedSeconds / totalDuration) * 100 : 0;

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && block) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const newElapsed = prev + 1;
          
          // Check if activity is complete
          if (newElapsed >= totalDuration) {
            setIsRunning(false);
            handleActivityComplete();
            return totalDuration;
          }
          
          // Notify when 5 minutes remaining
          if (totalDuration - newElapsed === 300) {
            sendNotification('Faltam 5 minutos!', `A atividade "${block.title}" está quase acabando.`);
          }
          
          return newElapsed;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, block, totalDuration]);

  const sendNotification = async (title: string, message: string) => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }

    // Database notification
    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title,
        message,
        type: 'info',
      });
    }

    toast({
      title,
      description: message,
    });
  };

  const handleActivityComplete = async () => {
    if (!block || !user) return;

    // Send completion notification
    await sendNotification(
      'Atividade concluída! 🎉',
      `Você completou "${block.title}". Bom trabalho!`
    );

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'completed_activity',
      entity_type: 'schedule_block',
      metadata: { 
        block_id: block.id, 
        block_title: block.title,
        duration_minutes: Math.round(elapsedSeconds / 60)
      }
    });

    onComplete(block);
  };

  const handleStart = async () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    setIsRunning(true);
    setStartTime(new Date());

    if (user && block) {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'started_activity',
        entity_type: 'schedule_block',
        metadata: { block_id: block.id, block_title: block.title }
      });
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setStartTime(null);
    onStop();
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!block) return null;

  return (
    <Card className={`p-6 border-2 ${categoryColors[block.category]} transition-all duration-300`}>
      <div className="flex flex-col items-center gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={categoryColors[block.category].split(' ')[0]}>
            {categoryIcons[block.category]}
          </div>
          <div className="text-center">
            <h3 className="font-display font-semibold text-lg text-foreground">
              {block.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {block.startTime} - {block.endTime}
            </p>
          </div>
          <Badge variant="secondary">{getCategoryLabel(block.category)}</Badge>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className="text-5xl font-mono font-bold text-foreground mb-2">
            {formatTime(remainingSeconds)}
          </div>
          <p className="text-sm text-muted-foreground">
            {isRunning ? 'Tempo restante' : elapsedSeconds > 0 ? 'Pausado' : 'Pronto para iniciar'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Decorrido: {formatTime(elapsedSeconds)}</span>
            <span>Total: {formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <Button 
              onClick={handleStart}
              className="bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {elapsedSeconds > 0 ? 'Continuar' : 'Iniciar'}
            </Button>
          ) : (
            <Button 
              onClick={handlePause}
              variant="secondary"
              size="lg"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pausar
            </Button>
          )}
          
          <Button 
            onClick={handleStop}
            variant="outline"
            size="lg"
          >
            <Square className="w-5 h-5 mr-2" />
            Parar
          </Button>

          {progress >= 100 && (
            <Button 
              onClick={() => onComplete(block)}
              className="bg-work hover:bg-work/90"
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Concluir
            </Button>
          )}
        </div>

        {/* Status indicators */}
        {isRunning && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
            <Clock className="w-4 h-4" />
            <span>Atividade em andamento...</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityTimer;

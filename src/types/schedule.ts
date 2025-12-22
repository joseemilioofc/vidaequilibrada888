// Schedule Block Types
export type BlockCategory = 'work' | 'leisure' | 'sleep';

export interface TimeBlock {
  id: string;
  startTime: string; // HH:MM format
  endTime: string;
  title: string;
  description?: string;
  category: BlockCategory;
}

export interface DaySchedule {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  theme?: string; // e.g., "Planejamento", "Execução técnica"
  blocks: TimeBlock[];
}

export interface WeeklySchedule {
  days: DaySchedule[];
}

// Goals
export interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  period: GoalPeriod;
}

export type GoalPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'yearly' | 'fiveYear';

export interface GoalSet {
  daily: Goal[];
  weekly: Goal[];
  monthly: Goal[];
  quarterly: Goal[];
  biannual: Goal[];
  yearly: Goal[];
  fiveYear: Goal[];
}

// Professional Template
export interface ProfessionalTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  focus: string[];
  weeklySchedule: WeeklySchedule;
  goals: GoalSet;
}

// Balance metrics
export interface BalanceMetrics {
  workHours: number;
  leisureHours: number;
  sleepHours: number;
  totalHours: number;
  isBalanced: boolean;
}

// Utility function to calculate hours from time blocks
export function calculateBlockDuration(block: TimeBlock): number {
  const [startHour, startMin] = block.startTime.split(':').map(Number);
  const [endHour, endMin] = block.endTime.split(':').map(Number);
  
  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;
  
  // Handle overnight blocks (e.g., 21:00 to 08:00)
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }
  
  return (endMinutes - startMinutes) / 60;
}

export function calculateDayBalance(schedule: DaySchedule): BalanceMetrics {
  let workHours = 0;
  let leisureHours = 0;
  let sleepHours = 0;

  schedule.blocks.forEach(block => {
    const duration = calculateBlockDuration(block);
    switch (block.category) {
      case 'work':
        workHours += duration;
        break;
      case 'leisure':
        leisureHours += duration;
        break;
      case 'sleep':
        sleepHours += duration;
        break;
    }
  });

  const totalHours = workHours + leisureHours + sleepHours;
  const isBalanced = Math.abs(workHours - 8) <= 1 && 
                     Math.abs(leisureHours - 8) <= 1 && 
                     Math.abs(sleepHours - 8) <= 1;

  return { workHours, leisureHours, sleepHours, totalHours, isBalanced };
}

export function getCategoryLabel(category: BlockCategory): string {
  switch (category) {
    case 'work': return 'Trabalho';
    case 'leisure': return 'Lazer/Família';
    case 'sleep': return 'Sono';
  }
}

export function getGoalPeriodLabel(period: GoalPeriod): string {
  switch (period) {
    case 'daily': return 'Diária';
    case 'weekly': return 'Semanal';
    case 'monthly': return 'Mensal';
    case 'quarterly': return 'Trimestral';
    case 'biannual': return 'Semestral';
    case 'yearly': return 'Anual';
    case 'fiveYear': return '5 Anos';
  }
}

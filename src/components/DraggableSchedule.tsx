import { useState } from 'react';
import { TimeBlock } from '@/types/schedule';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Copy,
  Trash2,
  Edit,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Heart,
  Moon,
} from 'lucide-react';

interface DraggableScheduleProps {
  blocks: TimeBlock[];
  onBlockEdit: (block: TimeBlock) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockDuplicate: (block: TimeBlock) => void;
  onBlocksReorder: (blocks: TimeBlock[]) => void;
}

const DraggableSchedule = ({
  blocks,
  onBlockEdit,
  onBlockDelete,
  onBlockDuplicate,
  onBlocksReorder,
}: DraggableScheduleProps) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work':
        return <Briefcase className="w-4 h-4" />;
      case 'leisure':
        return <Heart className="w-4 h-4" />;
      case 'sleep':
        return <Moon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'work':
        return 'border-l-work bg-work/5 hover:bg-work/10';
      case 'leisure':
        return 'border-l-leisure bg-leisure/5 hover:bg-leisure/10';
      case 'sleep':
        return 'border-l-sleep bg-sleep/5 hover:bg-sleep/10';
      default:
        return '';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'work':
        return 'badge-work';
      case 'leisure':
        return 'badge-leisure';
      case 'sleep':
        return 'badge-sleep';
      default:
        return '';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'work':
        return 'Trabalho';
      case 'leisure':
        return 'Lazer';
      case 'sleep':
        return 'Sono';
      default:
        return category;
    }
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedId(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    if (blockId !== draggedId) {
      setDragOverId(blockId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetBlockId) return;

    const newBlocks = [...blocks];
    const draggedIndex = newBlocks.findIndex(b => b.id === draggedId);
    const targetIndex = newBlocks.findIndex(b => b.id === targetBlockId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
      newBlocks.splice(targetIndex, 0, draggedBlock);
      onBlocksReorder(newBlocks);
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const index = newBlocks.findIndex(b => b.id === blockId);
    
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === newBlocks.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    
    onBlocksReorder(newBlocks);
  };

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => (
        <ContextMenu key={block.id}>
          <ContextMenuTrigger>
            <Card
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDrop={(e) => handleDrop(e, block.id)}
              className={`p-4 border-l-4 transition-all cursor-grab active:cursor-grabbing ${getCategoryStyles(block.category)} ${
                draggedId === block.id ? 'opacity-50 scale-95' : ''
              } ${
                dragOverId === block.id ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-muted-foreground cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-muted-foreground">
                      {block.startTime} - {block.endTime}
                    </span>
                    <Badge className={`text-xs ${getCategoryBadge(block.category)}`}>
                      {getCategoryIcon(block.category)}
                      <span className="ml-1">{getCategoryLabel(block.category)}</span>
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground">{block.title}</h4>
                  {block.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {block.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveBlock(block.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveBlock(block.id, 'down')}
                    disabled={index === blocks.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onBlockEdit(block)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </ContextMenuTrigger>
          
          <ContextMenuContent className="w-48">
            <ContextMenuItem onClick={() => onBlockEdit(block)} className="gap-2">
              <Edit className="w-4 h-4" />
              Editar bloco
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onBlockDuplicate(block)} className="gap-2">
              <Copy className="w-4 h-4" />
              Duplicar bloco
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => moveBlock(block.id, 'up')} className="gap-2" disabled={index === 0}>
              <ArrowUp className="w-4 h-4" />
              Mover para cima
            </ContextMenuItem>
            <ContextMenuItem onClick={() => moveBlock(block.id, 'down')} className="gap-2" disabled={index === blocks.length - 1}>
              <ArrowDown className="w-4 h-4" />
              Mover para baixo
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={() => onBlockDelete(block.id)} 
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Excluir bloco
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  );
};

export default DraggableSchedule;

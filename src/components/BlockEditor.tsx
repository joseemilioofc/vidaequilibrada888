import { useState } from 'react';
import { TimeBlock, BlockCategory, getCategoryLabel } from '@/types/schedule';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Heart, Moon, Trash2, Copy } from 'lucide-react';

interface BlockEditorProps {
  block: TimeBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: TimeBlock) => void;
  onDelete?: (blockId: string) => void;
  onDuplicate?: (block: TimeBlock) => void;
}

const BlockEditor = ({ block, isOpen, onClose, onSave, onDelete, onDuplicate }: BlockEditorProps) => {
  const [title, setTitle] = useState(block?.title || '');
  const [description, setDescription] = useState(block?.description || '');
  const [startTime, setStartTime] = useState(block?.startTime || '08:00');
  const [endTime, setEndTime] = useState(block?.endTime || '09:00');
  const [category, setCategory] = useState<BlockCategory>(block?.category || 'work');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedBlock: TimeBlock = {
      id: block?.id || crypto.randomUUID(),
      title,
      description,
      startTime,
      endTime,
      category,
    };

    onSave(updatedBlock);
    onClose();
  };

  const handleDelete = () => {
    if (block && onDelete) {
      onDelete(block.id);
      onClose();
    }
  };

  const handleDuplicate = () => {
    if (block && onDuplicate) {
      onDuplicate(block);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {block ? 'Editar Bloco' : 'Novo Bloco'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Deep Work - Codificação"
              className="bg-background/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a atividade..."
              className="bg-background/50 resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Início</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Fim</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as BlockCategory)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-work" />
                    <span>{getCategoryLabel('work')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="leisure">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-leisure" />
                    <span>{getCategoryLabel('leisure')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="sleep">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-sleep" />
                    <span>{getCategoryLabel('sleep')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            {block && (
              <div className="flex gap-2 mr-auto">
                {onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                {onDuplicate && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={handleDuplicate}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlockEditor;

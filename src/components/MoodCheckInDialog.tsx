import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smile, Meh, Frown, AlertCircle, Angry } from 'lucide-react';

interface MoodCheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMoodSelect: (mood: 'happy' | 'okay' | 'neutral' | 'worried' | 'angry') => void;
}

const moods = [
  { value: 'happy' as const, label: 'Happy', icon: Smile, color: 'text-green-500', bgColor: 'hover:bg-green-50 dark:hover:bg-green-950' },
  { value: 'okay' as const, label: 'Okay', icon: Smile, color: 'text-blue-500', bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950' },
  { value: 'neutral' as const, label: 'Neutral', icon: Meh, color: 'text-gray-500', bgColor: 'hover:bg-gray-50 dark:hover:bg-gray-950' },
  { value: 'worried' as const, label: 'Worried', icon: AlertCircle, color: 'text-yellow-500', bgColor: 'hover:bg-yellow-50 dark:hover:bg-yellow-950' },
  { value: 'angry' as const, label: 'Angry', icon: Angry, color: 'text-red-500', bgColor: 'hover:bg-red-50 dark:hover:bg-red-950' },
];

export const MoodCheckInDialog = ({ open, onOpenChange, onMoodSelect }: MoodCheckInDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How are you feeling today?</DialogTitle>
          <DialogDescription>
            Tracking your mood helps us provide better personalized recommendations
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3 py-4">
          {moods.map(({ value, label, icon: Icon, color, bgColor }) => (
            <Button
              key={value}
              variant="outline"
              className={`h-24 flex flex-col gap-2 ${bgColor}`}
              onClick={() => {
                onMoodSelect(value);
                onOpenChange(false);
              }}
            >
              <Icon className={`h-8 w-8 ${color}`} />
              <span className="text-sm">{label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodCheckInDialog;

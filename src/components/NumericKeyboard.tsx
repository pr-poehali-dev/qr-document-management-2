import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const NumericKeyboard = ({ onKeyPress, onBackspace, onClear }: NumericKeyboardProps) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'back'],
  ];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {keys.map((row, rowIndex) => (
        row.map((key, keyIndex) => {
          if (key === 'clear') {
            return (
              <Button
                key={`${rowIndex}-${keyIndex}`}
                onClick={onClear}
                variant="outline"
                className="h-16 text-lg font-bold bg-red-500 hover:bg-red-600 text-white border-red-600"
              >
                <Icon name="X" size={24} />
              </Button>
            );
          }
          if (key === 'back') {
            return (
              <Button
                key={`${rowIndex}-${keyIndex}`}
                onClick={onBackspace}
                variant="outline"
                className="h-16 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
              >
                <Icon name="Delete" size={24} />
              </Button>
            );
          }
          return (
            <Button
              key={`${rowIndex}-${keyIndex}`}
              onClick={() => onKeyPress(key)}
              variant="outline"
              className="h-16 text-2xl font-bold bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
            >
              {key}
            </Button>
          );
        })
      ))}
    </div>
  );
};

export default NumericKeyboard;

import { useRef } from 'react';
import { AriaDialogProps, useDialog } from 'react-aria';
import SvgClose from '@/svg_components/Close';
import { ResponsiveContainer } from './ui/ResponsiveContainer';
import Button from './ui/Button';

interface GenericDialogProps extends AriaDialogProps {
  title: string;
  handleClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function GenericDialog({ title, handleClose, children, className = '', ...props }: GenericDialogProps) {
  const dialogRef = useRef(null);
  const { dialogProps, titleProps } = useDialog(props, dialogRef);

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center ${className}`}>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <ResponsiveContainer className="relative w-full max-w-2xl">
        <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
          <div className="rounded-lg border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 
                {...titleProps} 
                className="text-lg font-semibold leading-none tracking-tight text-foreground"
              >
                {title}
              </h3>
              <Button
                onPress={handleClose}
                Icon={SvgClose}
                mode="ghost"
                size="small"
                className="h-8 w-8 rounded-full p-0 hover:bg-muted/50"
                aria-label="Close dialog"
              />
            </div>
            <div className="px-6 py-4 text-foreground">
              {children}
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}

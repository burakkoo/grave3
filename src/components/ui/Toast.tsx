import type { AriaToastProps } from '@react-aria/toast';
import { useToast } from '@react-aria/toast';
import { QueuedToast, ToastState } from '@react-stately/toast';
import { useRef, SVGProps, useState } from 'react';
import {
  Close,
  CircleActionsAlertInfo,
  CircleActionsClose,
  CircleActionsSuccess,
  NotificationBell,
} from '@/svg_components';
import { cn } from '@/lib/cn';
import { ToastType, toastColors } from '@/lib/toast';
import Button from './Button';

export const toastIcons = {
  default: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => <NotificationBell {...props} />,
  },
  success: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => <CircleActionsSuccess {...props} />,
  },
  warning: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => <CircleActionsAlertInfo {...props} />,
  },
  error: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => <CircleActionsClose {...props} />,
  },
};

interface ToastProps {
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ title, message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className={cn(
        "max-w-lg w-full mx-4 rounded-lg shadow-lg",
        "bg-card border border-border",
        "animate-in zoom-in duration-200"
      )}>
        <div className="p-6">
          <div className="flex items-start gap-3 mb-6">
            {type === 'success' && <CircleActionsSuccess className="h-6 w-6 text-primary mt-1 shrink-0" />}
            {type === 'error' && <CircleActionsClose className="h-6 w-6 text-destructive mt-1 shrink-0" />}
            {type === 'info' && <CircleActionsAlertInfo className="h-6 w-6 text-blue-500 mt-1 shrink-0" />}
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-foreground">{title}</h3>
              {message && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleClose}
              className={cn(
                "px-6 py-2 rounded-md font-medium",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

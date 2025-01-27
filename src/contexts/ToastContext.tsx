'use client';

import { createContext, useCallback, useState } from 'react';
import { Toast } from '@/components/ui/Toast';
import type { ToastProps } from '@/types/toast';

interface ToastContextType {
  showToast: (props: ToastProps) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  hideToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = useCallback((props: ToastProps) => {
    setToast(props);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && <Toast {...toast} onClose={hideToast} />}
    </ToastContext.Provider>
  );
}

export interface ToastProps {
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
} 
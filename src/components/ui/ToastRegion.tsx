'use client';

import type { AriaToastRegionProps } from '@react-aria/toast';
import type { ToastState, QueuedToast } from '@react-stately/toast';
import { useToastRegion } from '@react-aria/toast';
import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastType, toastVariants } from '@/lib/toast';

interface ToastRegionProps extends AriaToastRegionProps {
  state: ToastState<ToastType>;
}

interface ToastComponentProps {
  toast: QueuedToast<ToastType>;
  state: ToastState<ToastType>;
}

function Toast({ toast, state }: ToastComponentProps) {
  return (
    <div role="alert" className="rounded-md border bg-background p-4 shadow-lg">
      {toast.content.message}
    </div>
  );
}

export function ToastRegion({ state, ...props }: ToastRegionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { regionProps } = useToastRegion(props, state, ref);

  return (
    <div
      {...regionProps}
      ref={ref}
      className="fixed bottom-16 right-3 z-40 flex max-w-[320px] flex-col gap-3 focus:outline-none md:bottom-6 md:right-6"
    >
      <AnimatePresence>
        {state.visibleToasts.map((toast) => (
          <motion.div
            key={`${toast.key}-motion-container`}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Toast toast={toast} state={state} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

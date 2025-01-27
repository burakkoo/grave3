'use client';

import { Dispatch, SetStateAction, createContext, useMemo, useState } from 'react';
import { useOverlayTriggerState } from 'react-stately';
import { GetVisualMedia } from '@/types/definitions';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/Modal';
import { VisualMediaDialog } from '@/components/VisualMediaDialog';
import VisualMediaSlider from '@/components/VisualMediaSlider';

interface ModalState {
  visualMedia: GetVisualMedia[];
  initialSlide: number;
  profileId: string;
  onClose: () => void;
}

interface VisualMediaModalContext {
  show: () => void;
  hide: () => void;
  setModal: Dispatch<SetStateAction<ModalState>>;
}

export const VisualMediaModalContextApi = createContext<VisualMediaModalContext>({
  show: () => {},
  hide: () => {},
  setModal: () => {},
});

function VisualMediaModalContextProvider({ children }: { children: React.ReactNode }) {
  const state = useOverlayTriggerState({});
  const [modal, setModal] = useState<ModalState>({
    visualMedia: [],
    initialSlide: 0,
    profileId: '',
    onClose: () => {},
  });

  // Memoize to prevent unnecessary re-rendering of API consumers when `state` changes
  const memoizedContextApiValue = useMemo(
    () => ({
      show: state.open,
      hide: state.close,
      setModal,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Don't add `state.open` here, otherwise our memoization technique won't work
  );

  return (
    <VisualMediaModalContextApi.Provider value={memoizedContextApiValue}>
      {children}
      <AnimatePresence>
        {state.isOpen && (
          <Modal state={state}>
            <VisualMediaDialog>
              <VisualMediaSlider {...modal} onClose={state.close} />
            </VisualMediaDialog>
          </Modal>
        )}
      </AnimatePresence>
    </VisualMediaModalContextApi.Provider>
  );
}

export { VisualMediaModalContextProvider };

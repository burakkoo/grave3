import { VisualMediaModalContextApi } from '@/contexts/VisualMediaModalContext';
import { useContext } from 'react';
import { ShowModalOptions } from '@/types/definitions';

export function useVisualMediaModal() {
  const context = useContext(VisualMediaModalContextApi);
  
  if (!context) {
    throw new Error('useVisualMediaModal must be used within VisualMediaModalContextProvider');
  }

  const { setModal, show, hide } = context;
  
  const showVisualMediaModal = (options: ShowModalOptions) => {
    setModal({
      visualMedia: options.visualMedia,
      initialSlide: options.initialSlide,
      profileId: options.profileId,
      onClose: hide
    });
    show();
  };

  return { showVisualMediaModal };
}

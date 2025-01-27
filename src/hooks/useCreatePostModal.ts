import { useCreatePostModalContextApi } from '@/contexts/CreatePostModalContext';
import { GetVisualMedia } from '@/types/definitions';
import { set } from 'lodash';

export function useCreatePostModal() {
  const { setShown, setShouldOpenFileInputOnMount, setToEditValues, setProfileId, setUserId } =
    useCreatePostModalContextApi();

  const launchCreatePost = ({
    shouldOpenFileInputOnMount = false,
    profileId,
    userId,
  }: {
    shouldOpenFileInputOnMount?: boolean;
    profileId: string;
    userId: string;
  }) => {
    setToEditValues(null);
    setShouldOpenFileInputOnMount(shouldOpenFileInputOnMount);
    setShown(true);
    setProfileId(profileId);
    setUserId(userId);
  };

  const launchEditPost = ({
    initialContent,
    initialVisualMedia,
    postId,
  }: {
    initialContent: string;
    initialVisualMedia: GetVisualMedia[];
    postId: number;
  }) => {
    setToEditValues({
      postId,
      initialContent,
      initialVisualMedia,
    });
    setShown(true);
  };

  const exitCreatePostModal = () => {
    setShown(false);
  };

  return { launchCreatePost, launchEditPost, exitCreatePostModal };
}

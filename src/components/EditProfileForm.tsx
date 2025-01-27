'use client';

import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Item } from 'react-stately';
import {
  AtSign,
  BuildingBusinessOffice,
  Bullhorn,
  Heart,
  Other,
  Phone,
  Profile,
  WorldNet,
  Video,
} from '@/svg_components';
import { UserAboutSchema, userAboutSchema } from '@/lib/validations/userAbout';
import { formatISO } from 'date-fns';
import { parseDate } from '@internationalized/date';
import { useSessionUserData } from '@/hooks/useSessionUserData';
import { useSessionUserDataMutation } from '@/hooks/mutations/useSessionUserDataMutation';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { GenericLoading } from './GenericLoading';
import { DatePicker } from './ui/DatePicker';
import { Textarea } from './ui/Textarea';
import { Select } from './ui/Select';
import Button from './ui/Button';
import { FaTimes } from 'react-icons/fa';
import { TextInput } from './ui/TextInput';
import { date } from 'zod';

export function EditProfileForm({ redirectTo }: { redirectTo?: string }) {
  const [userData] = useSessionUserData();
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [spotifyPlaylist, setSpotifyPlaylist] = useState<string | null>(null);

  console.log('userData', userData);

  const defaultValues = useMemo(
    () => ({
      username: userData?.username || userData?.id || '',
      name: userData?.name || '',
      phoneNumber: userData?.phoneNumber || null,
      bio: userData?.bio || null,
      website: userData?.website || null,
      address: userData?.address || null,
      gender: userData?.gender || null,
      relationshipStatus: userData?.relationshipStatus || null,
      birthDate: userData?.birthDate?.toString() || null,
      dateOfPassing: userData?.dateOfPassing?.toString() || null,
      achievements: userData?.achievements || [],
      favoriteMusic: userData?.favoriteMusic.filter((item) => !item.includes('spotify')) || [],
      favoriteMovies: userData?.favoriteMovies || [],
      photos: userData?.photos || [],
      videos: userData?.videos || [],
      youtubeLink: userData?.youtubeLink || null,
      facebookLink: userData?.facebookLink || null,
      instagramLink: userData?.instagramLink || null,
      twitterLink: userData?.twitterLink || null,
      wikiLink: userData?.wikiLink || null,
    }),
    [userData],
  );

  const { control, handleSubmit, reset, setError, setFocus } = useForm<UserAboutSchema>({
    resolver: zodResolver(userAboutSchema),
    defaultValues,
  });

  const { updateSessionUserDataMutation } = useSessionUserDataMutation();
  const router = useRouter();

  const onValid: SubmitHandler<UserAboutSchema> = (data) => {
    data.photos = uploadedPhotos;
    data.videos = uploadedVideos;

    console.log('Data', data);

    setSpotifyPlaylist(spotifyPlaylist?.trim()!);
    if (spotifyPlaylist) {
      data.favoriteMusic?.push(spotifyPlaylist);
    } else {
      data.favoriteMusic = data.favoriteMusic ? data.favoriteMusic.filter((item) => !item.includes('spotify')) : null;
    }

    console.log('Music', data.favoriteMusic);
    console.log(spotifyPlaylist);

    updateSessionUserDataMutation.mutate(
      { data },
      {
        onError: (error) => {
          const { field, message } = JSON.parse(error.message) as {
            field: keyof UserAboutSchema;
            message: string;
          };
          setError(field, { message });
          setFocus(field);
        },
        onSuccess: () => {
          window.location.replace(redirectTo || `/profile/${data.username}`);
        },
      },
    );
  };

  const onInvalid: SubmitErrorHandler<UserAboutSchema> = (errors) => console.log(errors);

  const handleFileUpload = async (files: FileList, type: 'photos' | 'videos') => {
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fileBuffer = await file.arrayBuffer();
      const fileName = `${Date.now()}_${file.name}`;
      const contentType = file.type;

      const response = await fetch('/api/users/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: Buffer.from(fileBuffer).toString('base64'),
          fileName,
          contentType,
        }),
      });

      if (!response.ok) {
        console.error('Error uploading file:', await response.text());
        continue;
      }

      const { url } = await response.json();
      urls.push(url);
    }

    if (type === 'photos') setUploadedPhotos((prev) => [...prev, ...urls]);
    else setUploadedVideos((prev) => [...prev, ...urls]);
  };

  const removeItem = (type: 'photos' | 'videos', index: number) => {
    if (type === 'photos') {
      setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
    } else {
      setUploadedVideos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    reset(defaultValues);
  }, [userData]);

  useEffect(() => {
    setUploadedPhotos(defaultValues.photos || []);
    setUploadedVideos(defaultValues.videos || []);
    setSpotifyPlaylist(userData?.favoriteMusic?.find((item) => item.includes('spotify')) || null);
  }, []);

  if (!userData) return <GenericLoading>Loading form</GenericLoading>;

  return (
    <div>
      <form onSubmit={handleSubmit(onValid, onInvalid)} className="flex flex-col gap-4">
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <TextInput
              label="Username *"
              value={value}
              onChange={onChange}
              errorMessage={error?.message}
              ref={ref}
              Icon={AtSign}
            />
          )}
        />
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <TextInput
              label="Name *"
              value={value}
              onChange={onChange}
              errorMessage={error?.message}
              ref={ref}
              Icon={Profile}
            />
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <TextInput
              label="Phone Number"
              value={value || ''}
              onChange={(value) => onChange(value || null)}
              errorMessage={error?.message}
              ref={ref}
              Icon={Phone}
            />
          )}
        />
        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <Textarea
              label="Bio"
              value={value || ''}
              onChange={(value) => onChange(value || null)}
              errorMessage={error?.message}
              ref={ref}
              Icon={Bullhorn}
            />
          )}
        />
        <Controller
          control={control}
          name="website"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <TextInput
              label="Website"
              value={value || ''}
              onChange={(value) => onChange(value || null)}
              errorMessage={error?.message}
              ref={ref}
              Icon={WorldNet}
            />
          )}
        />
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <Select
              label="Gender"
              selectedKey={value || null}
              onSelectionChange={(key) => onChange(key || null)}
              errorMessage={error?.message}
              ref={ref}
              Icon={Other}>
              <Item key="MALE">Male</Item>
              <Item key="FEMALE">Female</Item>
              <Item key="NONBINARY">Nonbinary</Item>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="relationshipStatus"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <Select
              label="Relationship Status"
              selectedKey={value || null}
              onSelectionChange={(key) => onChange(key || null)}
              errorMessage={error?.message}
              ref={ref}
              Icon={Heart}>
              <Item key="SINGLE">Single</Item>
              <Item key="IN_A_RELATIONSHIP">In a relationship</Item>
              <Item key="ENGAGED">Engaged</Item>
              <Item key="MARRIED">Married</Item>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <DatePicker
              label="Birth Date"
              defaultValue={
                userData.birthDate && parseDate(formatISO(new Date(userData.birthDate), { representation: 'date' }))
              }
              onChange={(value) => onChange(value?.toString() || null)}
              errorMessage={error?.message}
              triggerRef={ref}
            />
          )}
        />
        <Controller
          control={control}
          name="dateOfPassing"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <DatePicker
              label="Date of Passing"
              defaultValue={
                userData.dateOfPassing &&
                parseDate(formatISO(new Date(userData.dateOfPassing), { representation: 'date' }))
              }
              onChange={(value) => onChange(value?.toString() || null)}
              errorMessage={error?.message}
              triggerRef={ref}
            />
          )}
        />

        <h2 className="mt-6 text-xl font-bold">Personal Interests and Achievements</h2>

        <Controller
          control={control}
          name="achievements"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <Textarea
              label="Achievements (Comma-separated)"
              value={value?.join(', ') || ''}
              onChange={(value) => onChange(value.split(',').map((item) => item.trim()))}
              errorMessage={error?.message}
              ref={ref}
            />
          )}
        />
        <Controller
          control={control}
          name="favoriteMusic"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <Textarea
              label="Favorite Music (Comma-separated)"
              value={value?.join(', ') || ''}
              onChange={(value) => onChange(value.split(',').map((item) => item.trim()))}
              errorMessage={error?.message}
              ref={ref}
            />
          )}
        />
        <Textarea
          label="Spotify Playlist (optional)"
          value={spotifyPlaylist || ''}
          onChange={(value) => setSpotifyPlaylist(value)}
        />
        <Controller
          control={control}
          name="favoriteMovies"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <Textarea
              label="Favorite Movies (Comma-separated)"
              value={value?.join(', ') || ''}
              onChange={(value) => onChange(value.split(',').map((item) => item.trim()))}
              errorMessage={error?.message}
              ref={ref}
            />
          )}
        />
        <Controller
          control={control}
          name="youtubeLink"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <TextInput
              label="Youtube Video Link (optional)"
              value={value || ''}
              onChange={(value) => onChange(value || null)}
              errorMessage={error?.message}
              ref={ref}
            />
          )}
        />

        <h2 className="mt-6 text-xl font-bold">Social Media</h2>
        <Controller
          control={control}
          name="facebookLink"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <TextInput
              label="Facebook"
              value={value || ''}
              onChange={(value) => onChange(value || null)}
              errorMessage={error?.message}
              ref={ref}
            />
          )}
        />

        <Controller
          control={control}
          name="instagramLink"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <TextInput
              label="Instagram"
              value={value || ''}
              onChange={(value) => onChange(value || null)}
              errorMessage={error?.message}
              ref={ref}
            />
          )}
        />

        <Controller
          control={control}
          name="twitterLink"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <TextInput
              label="Twitter"
              value={value || ''}
              onChange={(value) => onChange(value || null)}
              errorMessage={error?.message}
              ref={ref}
            />
          )}
        />

        <Controller
          control={control}
          name="wikiLink"
          render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
            <TextInput
              label="Wiki"
              value={value || ''}
              onChange={(value) => onChange(value || null)}
              errorMessage={error?.message}
              ref={ref}
            />
          )}
        />

        <div>
          <label className="block text-sm font-medium">Upload Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'photos')}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className="flex items-center gap-2">
                <p className="text-sm">{photo}</p>
                <button
                  type="button"
                  onClick={() => removeItem('photos', index)}
                  className="text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Videos</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'videos')}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {uploadedVideos.map((video, index) => (
              <div key={index} className="flex items-center gap-2">
                <p className="text-sm">{video}</p>
                <button
                  type="button"
                  onClick={() => removeItem('videos', index)}
                  className="text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            mode="secondary"
            type="button"
            loading={updateSessionUserDataMutation.isPending === true}
            onPress={() => reset(defaultValues)}>
            Reset
          </Button>
          <Button type="submit" loading={updateSessionUserDataMutation.isPending === true}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

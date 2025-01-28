'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { GetUser } from '@/types/definitions';
import { FaFacebook, FaInstagram, FaTwitter, FaWikipediaW, FaSpotify, FaYoutube } from 'react-icons/fa';
import { 
  FaTrophy, 
  FaMusic, 
  FaFilm, 
  FaQuoteLeft,
  FaImages,
  FaVideo
} from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

export function About({ profile: initialProfile }: { profile: GetUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(initialProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProfile(initialProfile);
    setIsLoading(false);
  }, [initialProfile]);

  // Force revalidation when the About tab is active
  useEffect(() => {
    if (pathname.endsWith('/about')) {
      // Add a small delay to ensure the revalidation happens after navigation
      const timeoutId = setTimeout(() => {
        router.refresh();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, router]);

  const {
    name,
    birthDate,
    dateOfPassing,
    bio,
    achievements,
    favoriteMusic,
    favoriteMovies,
    photos,
    videos,
    facebookLink,
    instagramLink,
    twitterLink,
    wikiLink,
    youtubeLink,
  } = profile;

  const spotifyPlaylist = favoriteMusic
    .filter((song) => song.includes('spotify'))
    .map((song) => song.split('playlist/')[1]);

  const favMusic = favoriteMusic.filter((song) => !song.includes('spotify'));

  const extractYouTubeVideoID = (url: string) => {
    // Regular expression to match YouTube video IDs
    const regex = /(?!youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null; // Return the video ID or null if not found
  };

  // Separate Spotify playlists and regular music
  const spotifyPlaylists = favoriteMusic.filter(song => song.includes('spotify'));
  const regularMusic = favoriteMusic.filter(song => !song.includes('spotify'));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse">
        {/* Add skeleton loading state here */}
        <div className="h-40 bg-muted rounded-lg mb-8"></div>
        <div className="h-20 bg-muted rounded-lg mb-4"></div>
        <div className="h-20 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl text-foreground">
      {/* Hero Memorial Section */}
      <header className="relative mb-16 text-center">
        <h1 className="font-serif text-4xl font-light text-primary md:text-5xl">
          In Loving Memory of
          <span className="mt-2 block font-serif text-5xl font-normal md:text-6xl">{name}</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          {birthDate && format(new Date(birthDate), 'MMMM d, yyyy')} -{' '}
          {dateOfPassing && format(new Date(dateOfPassing), 'MMMM d, yyyy')}
        </p>
        
        {/* Social Links */}
        <div className="mt-8 flex justify-center space-x-6">
          {facebookLink && (
            <a href={facebookLink} target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground transition-colors hover:text-blue-600">
              <FaFacebook className="h-6 w-6" />
            </a>
          )}
          {instagramLink && (
            <a href={instagramLink} target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground transition-colors hover:text-pink-600">
              <FaInstagram className="h-6 w-6" />
            </a>
          )}
          {twitterLink && (
            <a href={twitterLink} target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground transition-colors hover:text-blue-400">
              <FaTwitter className="h-6 w-6" />
            </a>
          )}
          {wikiLink && (
            <a href={wikiLink} target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground transition-colors hover:text-gray-600">
              <FaWikipediaW className="h-6 w-6" />
            </a>
          )}
        </div>
      </header>

      {/* Bio Section with Decorative Elements */}
      {bio && (
        <section className="mb-16 rounded-lg bg-card/50 p-8">
          <div className="mx-auto max-w-3xl text-center">
            <FaQuoteLeft className="mx-auto mb-6 h-8 w-8 text-primary/30" />
            <p className="font-serif text-xl leading-relaxed text-muted-foreground">
              {bio}
            </p>
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {photos && photos.length > 0 && (
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-center gap-3">
            <FaImages className="h-6 w-6 text-primary" />
            <h2 className="text-center font-serif text-3xl font-light text-primary">Photo Memories</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((photo, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={photo}
                  alt={`Memory of ${name}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {achievements && achievements.length > 0 && (
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-center gap-3">
            <FaTrophy className="h-6 w-6 text-primary" />
            <h2 className="text-center font-serif text-3xl font-light text-primary">Life Achievements</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <div key={index} className="rounded-lg bg-card/50 p-6">
                <p className="text-lg text-muted-foreground">{achievement}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Favorites Section */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Music Section */}
        {(regularMusic.length > 0 || spotifyPlaylists.length > 0) && (
          <section className="rounded-lg bg-card/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <FaMusic className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl font-light text-primary">Favorite Music</h2>
            </div>
            
            {/* Regular Music List */}
            {regularMusic.length > 0 && (
              <ul className="mb-6 space-y-3 text-muted-foreground">
                {regularMusic.map((song, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                    <span className="flex-1">{song}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Spotify Playlists */}
            {spotifyPlaylists.length > 0 && (
              <div className="space-y-4">
                {spotifyPlaylists.map((playlist, index) => {
                  const playlistId = playlist.split('playlist/')[1];
                  return (
                    <div key={index} className="overflow-hidden rounded-lg bg-black/5">
                      <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                        <FaSpotify className="h-5 w-5 text-green-500" />
                        <a 
                          href={playlist}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline"
                        >
                          Open in Spotify
                        </a>
                      </div>
                      <iframe
                        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Movies Section */}
        {favoriteMovies && favoriteMovies.length > 0 && (
          <section className="rounded-lg bg-card/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <FaFilm className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl font-light text-primary">Favorite Movies</h2>
            </div>
            <ul className="space-y-3 text-muted-foreground">
              {favoriteMovies.map((movie, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                  <span className="flex-1">{movie}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Videos Section */}
      {(videos?.length > 0 || youtubeLink) && (
        <section className="mt-16">
          <div className="mb-8 flex items-center justify-center gap-3">
            <FaVideo className="h-6 w-6 text-primary" />
            <h2 className="text-center font-serif text-3xl font-light text-primary">Video Memories</h2>
          </div>
          <div className="grid gap-6">
            {/* Local Videos */}
            {videos?.map((video, index) => (
              <div key={index} className="overflow-hidden rounded-lg bg-card/50">
                <div className="aspect-video">
                  <video 
                    controls 
                    className="h-full w-full"
                    poster="/video-thumbnail.jpg"
                  >
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ))}

            {/* YouTube Video */}
            {youtubeLink && (
              <div className="overflow-hidden rounded-lg bg-card/50">
                <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                  <FaYoutube className="h-5 w-5 text-red-500" />
                  <a 
                    href={youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline"
                  >
                    Watch on YouTube
                  </a>
                </div>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${extractYouTubeVideoID(youtubeLink)}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="border-0"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

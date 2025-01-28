import { VisualMediaType, User, Follow, ActivityType, Gender } from '@prisma/client';

type UserSummary = Pick<User, 'id' | 'username' | 'name' | 'profilePhoto'>;
/**
 * The `User` type from Prisma indicates that the `username` and `name` fields are nullable,
 * however, after the initial user setup upon user's registration, these two fields will be
 * guaranteed to be filled in.
 */
export interface UserSummaryAfterSetUp {
  id: string;
  username: string;
  name: string;
  profilePhoto: string | null;
}

interface UserAfterSetUp extends User {
  username: string;
  name: string;
}

// Use this type when finding a User in prisma.
export interface FindUserResult extends User {
  followers: Follow[];
  _count: {
    following: number;
    followers: number;
  };
}

/**
 * The <FindUserResult> shall be converted to <GetUser>, use
 * the ./src/lib/prisma/toGetUser.ts function to do this.
 * <GetUser> must be the response type of GET users route handlers.
 */
export interface GetUser extends UserAfterSetUp {
  followerCount: number | null;
  followingCount: number | null;
  isFollowing: boolean | null; // true when the authenticated user is following the user being requested

  dateOfPassing: Date | null;
  achievements: string[];
  favoriteMusic: string[];
  favoriteMovies: string[];
  photos: string[];
  videos: string[];

  youtubeLink: string | null;
  facebookLink: string | null;
  instagramLink: string | null;
  twitterLink: string | null;
  wikiLink: string | null;
}

export interface GetVisualMedia {
  type: VisualMediaType;
  url: string;
  caption: string | null;
}

// Use this type when finding a Post in prisma.
export interface FindPostResult {
  id: string;
  content: string | null;
  createdAt: Date;
  PostedBy: string | null;
  Relation: string | null;
  postLikes: {
    id: number;
  }[];
  user: UserSummary;
  visualMedia: VisualMedia[];
  _count: {
    postLikes: number;
    comments: number;
  };
}

/**
 * The <FindPostResult> shall be converted to <GetPost>, use
 * the ./src/lib/prisma/toGetPost.ts function to do this.
 * <GetPost> must be the response type of GET posts route handlers.
 */
export interface GetPost {
  id: string;
  content: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    profilePhoto: string | null;
  };
  PostedBy: string | null;
  Relation: string | null;
  isApproved: boolean;
  isLiked: boolean;
  _count: {
    postLikes: number;
    comments: number;
  };
  visualMedia?: GetVisualMedia[];
}

/**
 * Use `PostIds` when rendering a list of <Post>'s, this type
 * must be passed to <Post>, and <Post> must use the `id` to
 * check for queried post data using this `queryKey` format:
 * ['posts', number] where number is the post's id
 */
export interface PostIds {
  id: number;
  commentsShown: boolean;
}

// Add PostIdsArray type if needed across multiple files
export type PostIdsArray = PostIds[];

// Use this type when finding a Comment in prisma.
export interface FindCommentResult {
  id: number;
  content: string;
  createdAt: Date;
  userId: string | null;
  postId: number;
  user: {
    id: string;
    name: string;
    username: string;
  };
}

/**
 * The <FindCommentResult> shall be converted to <GetComment>, use
 * the ./src/lib/prisma/toGetComment.ts function to do this.
 * <GetComment> must be the response type of GET comments route handlers.
 */
export type GetComment = {
  id: number;
  content: string;
  createdAt: string;
  userId: string | null;
  postId: number;
  PostedBy: string | null;
  Relation: string | null;
  isApproved: boolean;
  user: {
    id: string;
    name: string;
    username: string;
  } | null;
};

export interface DiscoverFilters {
  gender?: 'MALE' | 'FEMALE' | 'NONBINARY';
  relationshipStatus?: 'SINGLE' | 'IN_A_RELATIONSHIP' | 'ENGAGED' | 'MARRIED';
}

interface FindActivityResult {
  id: number;
  type: ActivityType;
  sourceId: number;
  targetId: number | null;
  createdAt: Date;
  isNotificationRead: boolean;
  sourceUser: UserSummary & { gender: Gender | null };
  targetUser: UserSummary & { gender: Gender | null };
}
export type FindActivityResults = FindActivityResult[];

export interface GetActivity extends FindActivityResult {
  sourceUser: UserSummaryAfterSetUp & { gender: Gender | null };
  targetUser: UserSummaryAfterSetUp & { gender: Gender | null };
  content?: string | null;
}
export type GetActivities = GetActivity[];

export interface CommentUser {
  id: string | null;
  name: string | null;
  username: string | null;
  profilePhoto: string | null;
}

export interface CommentCounts {
  commentLikes: number;
  replies?: number;
}

// Add isOwnProfile to ShowModalOptions interface
export interface ShowModalOptions {
  visualMedia: GetVisualMedia[];
  initialSlide: number;
  profileId: string;
  isOwnProfile?: boolean;
}

// Move this interface to the top level and enhance it
export interface VisualMedia {
  id: number;
  type: VisualMediaType;
  fileName: string;
  uploadedAt: Date;
  userId: string;
  postId: number;
  url?: string; // Make url optional for Prisma results
}

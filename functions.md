# Core Functions Documentation

## Photo Management Functions

### Profile & Cover Photo Updates
- `useUpdateProfileAndCoverPhoto`
  - Handles server-side profile and cover photo updates
  - Validates file types (JPEG, JPG, PNG)
  - Manages S3 storage operations
  - Updates database records
  - Returns updated photo URLs

- `useUpdateProfileAndCoverPhotoClient`
  - Client-side handler for photo updates
  - Manages file input references
  - Handles position adjustments for cover photos
  - Updates React Query cache
  - Provides loading states and error handling

### Gallery Management
- `Gallery` Component
  - Displays user's photo gallery in grid layout
  - Supports photo selection and bulk deletion
  - Integrates with visual media modal
  - Handles optimistic updates

### Visual Media Functions
- `PostVisualMediaContainer`
  - Manages layout for post images/videos
  - Handles media preview and full-screen viewing
  - Supports responsive grid layouts
  - Integrates with delete functionality

## Post Management

### Create & Edit Posts
- `CreatePostDialog`
  - Handles post creation with multiple media
  - Supports image resizing and aspect ratio management
  - Manages file uploads and previews
  - Integrates with recaptcha verification

- `useWritePostMutations`
  - Manages post creation and updates
  - Handles optimistic updates
  - Manages React Query cache updates
  - Provides error handling and success notifications

### Delete Functions
- `deletePhotoMutation`
  - Handles photo deletion from posts and gallery
  - Updates related posts and cache
  - Manages S3 storage cleanup
  - Provides optimistic UI updates

## Comment Management

### Comment Functions
- `Comments` Component
  - Manages comment display and interactions
  - Handles comment creation and deletion
  - Supports nested replies
  - Integrates with approval system

### Pending Comments
- `PendingComments` Component
  - Manages unapproved comments queue
  - Handles comment approval workflow
  - Updates multiple related queries
  - Provides optimistic UI updates

## Profile Management

### Profile Components
- `ProfilePhoto` Component
  - Handles profile photo display and updates
  - Manages upload workflow
  - Supports preview and cropping
  - Integrates with visual media modal

- `CoverPhoto` Component
  - Manages cover photo display and updates
  - Supports position adjustment
  - Handles responsive sizing
  - Provides drag-and-drop positioning

## Common Utilities

### Media Handling
- `resizeImage`
  - Handles image resizing for uploads
  - Maintains aspect ratios
  - Optimizes file sizes
  - Supports multiple formats

### Cache Management
- `invalidateUserCache`
  - Manages React Query cache invalidation
  - Updates related queries
  - Ensures data consistency
  - Handles optimistic updates

### Authentication
- `getServerUser`
  - Validates user sessions
  - Provides user context
  - Manages authentication state
  - Supports role-based access

### QR Code Generation
- `generateQrCodes`
  - Generates a specified number of unique QR codes.
  - Each QR code is associated with a unique activation code.
  - Saves generated QR codes to the database using Prisma.
  - Utilizes UUID for QR code generation and crypto for activation codes.

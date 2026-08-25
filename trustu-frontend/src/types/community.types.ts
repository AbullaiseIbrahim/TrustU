export interface Community {
  id: string
  name: string
  description: string
  memberCount: number
  subCommunities?: SubCommunity[]
}

export interface SubCommunity {
  id: string
  name: string
  memberCount: number
}

export interface CommunityMember {
  /**
   * Row id from the membership list response. On some API responses this is
   * the community_user pivot row's own id, NOT the member's user id — do not
   * use this for friend-request targets, self checks, or profile lookups.
   * Use `userId` for those. Kept only as a stable React `key`.
   */
  id: string
  /** The member's actual user id — use this for isSelf checks, friend requests, profile navigation, etc. */
  userId: string
  name: string
  designation: string | null
  avatarUrl: string | null
  joinedAt: string | null
  /** Raw status from the API, e.g. null, 'pending', 'accepted' */
  friendshipStatus: string | null
}

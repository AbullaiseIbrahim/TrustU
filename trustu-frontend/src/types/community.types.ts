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
  id: string            // user id
  name: string
  designation: string | null
  avatarUrl: string | null
  joinedAt: string | null
  /** Raw status from the API, e.g. null, 'pending', 'accepted' */
  friendshipStatus: string | null
}

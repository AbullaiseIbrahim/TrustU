export interface Post {
  id: string
  userId: string
  userName: string
  userDesignation: string
  userAvatarUrl: string | null
  title: string
  description: string
  likes: number
  commentCount: number
  hasLiked: boolean
  createdAt: string
  /** mutual friends count — optional, not always returned by API */
  mutualCount?: number
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatarUrl: string | null
  content: string
  createdAt: string
}

export interface CreatePostPayload {
  community_id: string
  sub_community_id?: string
  title: string
  description: string
}

export interface CreateCommentPayload {
  content: string
}

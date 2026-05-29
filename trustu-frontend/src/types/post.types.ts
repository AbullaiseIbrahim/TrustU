export interface Post {
  id: string
  userId: string
  userName: string
  userDesignation: string
  title: string
  description: string
  upvotes: number
  replyCount: number
  hasUpvoted: boolean
  createdAt: string
}

export interface Reply {
  id: string
  postId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface CreatePostPayload {
  community_id: string
  title: string
  description: string
}

export interface CreateReplyPayload {
  content: string
}

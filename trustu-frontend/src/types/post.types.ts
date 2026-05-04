export interface Post {
  id: string
  userId: string
  userName: string
  userDesignation: string
  content: string
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
  content: string
}

export interface CreateReplyPayload {
  content: string
}

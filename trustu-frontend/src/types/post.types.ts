export interface Post {
  id: string
  userId: string
  userName: string
  userDesignation: string
  title: string
  description: string
  likes: number
  commentCount: number
  hasLiked: boolean
  createdAt: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
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

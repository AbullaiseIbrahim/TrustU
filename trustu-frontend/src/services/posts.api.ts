import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { Post, Comment, CreatePostPayload, CreateCommentPayload } from '@/types/post.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePost(raw: any): Post {
  const userProfile = raw.user?.profile ?? {}
  return {
    id:              String(raw.id ?? ''),
    userId:          String(raw.user_id   ?? raw.userId          ?? ''),
    userName:        String(raw.user?.name ?? raw.user_name      ?? raw.userName      ?? ''),
    userDesignation: String(userProfile.designation ?? userProfile.profile_type ?? raw.user?.designation ?? raw.user_designation ?? raw.userDesignation ?? ''),
    userAvatarUrl:   userProfile.profile_image ?? raw.user?.avatar_url ?? raw.user_avatar_url ?? null,
    title:           String(raw.title       ?? ''),
    description:     String(raw.description ?? raw.body          ?? ''),
    likes:           Number(raw.likes_count ?? raw.upvotes       ?? raw.likes         ?? 0),
    commentCount:    Number(raw.comments_count ?? raw.reply_count ?? raw.commentCount ?? 0),
    hasLiked:        Boolean(raw.has_liked  ?? raw.has_upvoted   ?? raw.hasLiked      ?? false),
    createdAt:       String(raw.created_at  ?? raw.createdAt     ?? ''),
    mutualCount:     raw.mutual_count != null ? Number(raw.mutual_count) : (raw.mutualCount != null ? Number(raw.mutualCount) : undefined),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeComment(raw: any): Comment {
  const userProfile = raw.user?.profile ?? {}
  return {
    id:           String(raw.id ?? ''),
    postId:       String(raw.post_id ?? raw.postId ?? ''),
    userId:       String(raw.user_id ?? raw.userId ?? ''),
    userName:     String(raw.user?.name ?? raw.user_name ?? raw.userName ?? ''),
    userAvatarUrl: userProfile.profile_image ?? raw.user?.avatar_url ?? null,
    content:      String(raw.content ?? raw.body ?? ''),
    createdAt:    String(raw.created_at ?? raw.createdAt ?? ''),
  }
}

export const postsApi = {
  list: async (params?: Record<string, unknown>): Promise<PaginatedResponse<Post>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<any>(ENDPOINTS.posts.list(), { params })
    return {
      data:    (data.data ?? []).map(normalizePost),
      meta: {
        total:       data.total        ?? data.meta?.total       ?? 0,
        currentPage: data.current_page ?? data.meta?.currentPage ?? 1,
        lastPage:    data.last_page    ?? data.meta?.lastPage    ?? 1,
        perPage:     data.per_page     ?? data.meta?.perPage     ?? 15,
        from:        data.from         ?? data.meta?.from        ?? 0,
        to:          data.to           ?? data.meta?.to          ?? 0,
      },
      message: data.message ?? '',
      success: data.success ?? true,
    } as PaginatedResponse<Post>
  },

  create: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await apiClient.post<ApiResponse<Post>>(ENDPOINTS.posts.create(), payload)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return normalizePost(data.data as any)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.posts.delete(id))
  },

  /** Toggle like — calls /like or /unlike based on current state */
  like: async (id: string): Promise<void> => {
    await apiClient.post(ENDPOINTS.posts.like(id))
  },

  unlike: async (id: string): Promise<void> => {
    await apiClient.post(ENDPOINTS.posts.unlike(id))
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any[]>>(ENDPOINTS.posts.comments(postId))
    return (data.data ?? []).map(normalizeComment)
  },

  createComment: async (postId: string, payload: CreateCommentPayload): Promise<Comment> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.post<ApiResponse<any>>(
      ENDPOINTS.posts.createComment(postId),
      payload,
    )
    return normalizeComment(data.data)
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.posts.deleteComment(commentId))
  },
}

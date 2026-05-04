import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { Post, Reply, CreatePostPayload, CreateReplyPayload } from '@/types/post.types'

export const postsApi = {
  list: async (params?: Record<string, unknown>): Promise<PaginatedResponse<Post>> => {
    const { data } = await apiClient.get<PaginatedResponse<Post>>(ENDPOINTS.posts.list(), {
      params,
    })
    return data
  },

  create: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await apiClient.post<ApiResponse<Post>>(ENDPOINTS.posts.create(), payload)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.posts.delete(id))
  },

  upvote: async (id: string): Promise<Post> => {
    const { data } = await apiClient.post<ApiResponse<Post>>(ENDPOINTS.posts.upvote(id))
    return data.data
  },

  getReplies: async (postId: string): Promise<Reply[]> => {
    const { data } = await apiClient.get<ApiResponse<Reply[]>>(ENDPOINTS.posts.replies(postId))
    return data.data
  },

  createReply: async (postId: string, payload: CreateReplyPayload): Promise<Reply> => {
    const { data } = await apiClient.post<ApiResponse<Reply>>(
      ENDPOINTS.posts.createReply(postId),
      payload,
    )
    return data.data
  },
}

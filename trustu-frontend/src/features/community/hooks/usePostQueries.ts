import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '@/services/posts.api'
import { useSnackbar } from '@/app/SnackbarProvider'
import type { CreatePostPayload, CreateReplyPayload } from '@/types/post.types'

export const POST_QUERY_KEYS = {
  list: ['posts'] as const,
  replies: (postId: string) => ['posts', postId, 'replies'] as const,
}

/** Fetch paginated community posts — requires communityId to filter correctly */
export const usePosts = (communityId?: string | null) =>
  useQuery({
    queryKey: [...POST_QUERY_KEYS.list, communityId],
    queryFn: () => postsApi.list({ community_id: communityId }),
    enabled: !!communityId,
    staleTime: 30_000,
  })

/** Create a new post */
export const useCreatePost = () => {
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.list })
      showSuccess('Query posted successfully!')
    },
    onError: () => {
      showError('Failed to post query. Please try again.')
    },
  })
}

/** Toggle upvote on a post */
export const useUpvotePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => postsApi.upvote(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.list })
    },
  })
}

/** Delete a post */
export const useDeletePost = () => {
  const { showInfo, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => postsApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.list })
      showInfo('Post deleted.')
    },
    onError: () => {
      showError('Failed to delete post.')
    },
  })
}

/** Fetch replies for a post */
export const useReplies = (postId: string) =>
  useQuery({
    queryKey: POST_QUERY_KEYS.replies(postId),
    queryFn: () => postsApi.getReplies(postId),
    enabled: !!postId,
  })

/** Create a reply on a post */
export const useCreateReply = (postId: string) => {
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateReplyPayload) => postsApi.createReply(postId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.replies(postId) })
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.list })
      showSuccess('Reply posted!')
    },
    onError: () => {
      showError('Failed to post reply.')
    },
  })
}

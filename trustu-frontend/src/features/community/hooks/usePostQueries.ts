import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '@/services/posts.api'
import { useSnackbar } from '@/app/SnackbarProvider'
import type { Post, CreatePostPayload, CreateCommentPayload } from '@/types/post.types'

export const POST_QUERY_KEYS = {
  list: ['posts'] as const,
  comments: (postId: string) => ['posts', postId, 'comments'] as const,
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
  const { showSuccess } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.list })
      showSuccess('Post created successfully!')
    },
  })
}

/** Toggle like on a post — calls /like or /unlike based on current state */
export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, hasLiked }: { postId: string; hasLiked: boolean }) =>
      hasLiked ? postsApi.unlike(postId) : postsApi.like(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.list })
    },
  })
}

/** Delete a post */
export const useDeletePost = () => {
  const { showInfo } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => postsApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.list })
      showInfo('Post deleted.')
    },
  })
}

/** Fetch comments for a post */
export const useComments = (postId: string) =>
  useQuery({
    queryKey: POST_QUERY_KEYS.comments(postId),
    queryFn: () => postsApi.getComments(postId),
    enabled: !!postId,
  })

/** Create a comment on a post */
export const useCreateComment = (postId: string) => {
  const { showSuccess } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => postsApi.createComment(postId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.comments(postId) })
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.list })
      showSuccess('Comment posted!')
    },
  })
}

/** Delete a comment */
export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) => postsApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.comments(postId) })
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.list })
    },
  })
}

// ── Legacy alias kept so PostCard import doesn't break ────────────────────────
export { useLikePost as useUpvotePost }
export type { Post }

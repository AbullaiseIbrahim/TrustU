import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi, type UpdateProfilePayload } from '@/services/profile.api'
import { useSnackbar } from '@/app/SnackbarProvider'
import { useAuth } from '@/app/AuthProvider'

export const PROFILE_QUERY_KEY = ['profile', 'me'] as const

/** Fetch the current user's profile from GET /user/profile */
export function useProfileQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileApi.get,
    staleTime: 1000 * 60 * 5, // 5 min
  })
}

/** Update profile fields via POST /user/profile */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()
  const { updateUser } = useAuth()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.update(payload),
    onSuccess: (updatedUser) => {
      // Refresh profile cache
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser)
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      // Also update the in-memory auth user so the top bar reflects changes instantly
      updateUser(updatedUser)
      showSuccess('Profile updated!')
    },
    onError: () => showError('Could not update profile. Please try again.'),
  })
}

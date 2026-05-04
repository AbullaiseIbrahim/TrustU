import React from 'react'
import { Box } from '@mui/material'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import CreatePostInput from '../components/CreatePostInput'
import PostCard from '../components/PostCard'
import { usePosts } from '../hooks/usePostQueries'
import ContentSkeleton from '@/components/ContentSkeleton'
import EmptyState from '@/components/EmptyState'

const CommunityPage: React.FC = () => {
  const { data, isLoading, isError } = usePosts()
  const posts = data?.data ?? []

  return (
    <Box>
      {/* Create post input */}
      <CreatePostInput />

      {/* Posts list */}
      {isLoading && <ContentSkeleton count={4} variant="post" />}

      {!isLoading && isError && (
        <EmptyState
          title="Couldn't load posts"
          description="Something went wrong. Please try again later."
          icon={<ForumOutlinedIcon />}
        />
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <EmptyState
          title="No queries yet"
          description="Be the first to ask something in your community!"
          icon={<ForumOutlinedIcon />}
        />
      )}

      {!isLoading && !isError && posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  )
}

export default CommunityPage

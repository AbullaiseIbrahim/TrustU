import React, { Suspense, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import DashboardNavbar from '../components/DashboardNavbar'
import CommunityHeader from '../components/CommunityHeader'
import DashboardTabs from '../components/DashboardTabs'
import AddServiceModal from '../components/AddServiceModal'
import { useAuth } from '@/app/AuthProvider'
import { PATHS } from '@/routes/paths'
import type { Community } from '@/types/community.types'
import colors from '@/theme/colors'

const useStyles = makeStyles()(() => ({
  page: {
    minHeight: '100vh',
    backgroundColor: colors.bgMint,
  },
  container: {
    maxWidth: 1100,
    width: '100%',
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 8px',
    '@media (min-width:600px)': {
      padding: '0 16px',
    },
    '@media (min-width:1116px)': {
      padding: '0',
    },
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
}))

const DashboardLayout: React.FC = () => {
  const { classes } = useStyles()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [addServiceOpen, setAddServiceOpen] = useState(false)

  const community: Community | undefined = user?.communityId
    ? {
      id: user.communityId,
      name: user.communityName ?? 'Your Community',
      description: '',
      memberCount: 0,
    }
    : undefined

  return (
    <Box className={classes.page}>
      <Box className={classes.stickyHeader}>
        <DashboardNavbar />
      </Box>
      <Box className={classes.container}>
        <CommunityHeader
          community={community}
          onAddService={() => setAddServiceOpen(true)}
          onSellProduct={() => navigate(PATHS.dashboard.marketplace)}
        />
        <DashboardTabs />
        <Box className={classes.content}>
          <Suspense
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
                <CircularProgress size={32} />
              </Box>
            }
          >
            <Outlet />
          </Suspense>
        </Box>
      </Box>

      <AddServiceModal
        open={addServiceOpen}
        onClose={() => setAddServiceOpen(false)}
      />
    </Box>
  )
}

export default DashboardLayout

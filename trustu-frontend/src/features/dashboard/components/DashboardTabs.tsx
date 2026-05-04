import React from 'react'
import { Tabs, Tab, Box, Typography } from '@mui/material'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import { makeStyles } from 'tss-react/mui'
import { useNavigate, useLocation } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'
import { useAccommodations } from '@/features/accommodation/hooks/useAccommodationQueries'

interface TabItem {
  label: string
  icon: React.ReactElement
  path: string
  count?: number
}

const useStyles = makeStyles()(() => ({
  wrapper: {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.divider}`,
  },
  tabs: {
    minHeight: 44,
  },
  indicator: {
    height: 3,
    borderRadius: '3px 3px 0 0',
    backgroundColor: colors.primary,
  },
  tab: {
    textTransform: 'none',
    minHeight: 44,
    minWidth: 'auto',
    padding: '0px 16px',
    color: colors.textSecondary,
    '&.Mui-selected': {
      color: colors.primary,
    },
    '@media (max-width:600px)': {
      padding: '0px 10px',
    },
  },
  tabLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  tabIcon: {
    fontSize: '1rem !important',
    flexShrink: 0,
  },
  tabText: {
    fontSize: '0.82rem',
    fontWeight: 500,
    lineHeight: 1,
    '.Mui-selected &': { fontWeight: 600 },
    '@media (max-width:600px)': { fontSize: '0.78rem' },
  },
  countBadge: {
    fontSize: '0.72rem',
    fontWeight: 400,
    color: colors.textDisabled,
    lineHeight: 1,
    marginLeft: 1,
  },
}))

const DashboardTabs: React.FC = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: accommodationData } = useAccommodations()
  const accommodationCount = accommodationData?.data?.length ?? 0

  const TAB_ITEMS: TabItem[] = [
    { label: 'Community',     icon: <ForumOutlinedIcon />,     path: PATHS.dashboard.community },
    { label: 'Accommodation', icon: <HomeWorkOutlinedIcon />,   path: PATHS.dashboard.accommodation, count: accommodationCount },
    { label: 'Buy & Sell',    icon: <StorefrontOutlinedIcon />, path: PATHS.dashboard.marketplace,   count: 0 },
  ]

  const currentTabIndex = TAB_ITEMS.findIndex((item) =>
    location.pathname.includes(item.path),
  )
  const activeIndex = currentTabIndex === -1 ? 0 : currentTabIndex

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(TAB_ITEMS[newValue].path)
  }

  return (
    <Box className={classes.wrapper}>
      <Tabs
        value={activeIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        className={classes.tabs}
        classes={{ indicator: classes.indicator }}
      >
        {TAB_ITEMS.map((item) => (
          <Tab
            key={item.path}
            className={classes.tab}
            disableRipple={false}
            label={
              <Box className={classes.tabLabel}>
                <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                  {React.cloneElement(item.icon, { className: classes.tabIcon })}
                </Box>
                <Typography component="span" className={classes.tabText}>
                  {item.label}
                </Typography>
                {item.count !== undefined && (
                  <Typography component="span" className={classes.countBadge}>
                    {item.count}
                  </Typography>
                )}
              </Box>
            }
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default DashboardTabs

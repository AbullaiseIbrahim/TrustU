import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Typography,
  Stack,
} from '@mui/material'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import AuthCard from '../components/AuthCard'
import TrustULogo from '../components/TrustULogo'
import { PATHS } from '@/routes/paths'

const features = [
  {
    icon: <SecurityOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />,
    label: 'Trusted community members only',
  },
  {
    icon: <FavoriteOutlinedIcon sx={{ color: '#E57373', fontSize: 22 }} />,
    label: 'Real connections, real help',
  },
  {
    icon: <PeopleAltOutlinedIcon sx={{ color: '#42A5F5', fontSize: 22 }} />,
    label: 'Services within your circles',
  },
]

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <AuthCard maxWidth={480}>
      {/* Logo */}
      <TrustULogo size={72} />

      {/* Brand name */}
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}
      >
        TrustU
      </Typography>

      {/* Tagline */}
      <Typography
        variant="h6"
        align="center"
        sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}
      >
        Seek Service from Your Own
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{ mb: 3, lineHeight: 1.65 }}
      >
        Find services, short stays, or sell and buy—all within your trusted
        circles. No strangers. No spam. Just real people, real help.
      </Typography>

      {/* Beta announcement banner */}
      <Box
        sx={{
          backgroundColor: '#E8F5E9',
          border: '1px solid #C8E6C9',
          borderRadius: '10px',
          px: 2.5,
          py: 1.75,
          mb: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'primary.dark', lineHeight: 1.6 }}>
          You're among our first users, and we welcome your feedback to help us
          grow and improve together
        </Typography>
      </Box>

      {/* Feature list */}
      <Stack spacing={1.75} sx={{ mb: 4 }}>
        {features.map(({ icon, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {icon}
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* CTA */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={() => navigate(PATHS.auth.login)}
        sx={{ py: 1.6, fontSize: '1rem', fontWeight: 600 }}
      >
        Get Started
      </Button>
    </AuthCard>
  )
}

export default LandingPage

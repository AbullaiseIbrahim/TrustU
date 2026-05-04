import type { TypographyOptions } from '@mui/material/styles/createTypography'

export const typography: TypographyOptions = {
  fontFamily: ['"DM Sans"', '-apple-system', 'Arial', 'sans-serif'].join(','),
  h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.25 },
  h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
  h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.35 },
  h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.45 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.57 },
  button: { fontSize: '0.9375rem', fontWeight: 600, textTransform: 'none' },
}

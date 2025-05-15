'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { red, deepPurple } from '@mui/material/colors';

// Creating a Material 3 Expressive theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: deepPurple[500],
      light: deepPurple[300],
      dark: deepPurple[700],
    },
    secondary: {
      main: red[600],
      light: red[400],
      dark: red[800],
    },
    background: {
      default: '#141414',
      paper: '#1f1f1f',
    },
  },
  typography: {
    fontFamily: '"Netflix Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(20, 20, 20, 0.7)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
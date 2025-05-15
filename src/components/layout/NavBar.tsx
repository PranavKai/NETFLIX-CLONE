'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  alpha,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Notifications, 
  ArrowDropDown,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '0%',
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.standard,
  }),
  '&.open': {
    width: '100%',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const NavItems = [
  { title: 'Home', href: '/' },
  { title: 'TV Shows', href: '/shows' },
  { title: 'Movies', href: '/movies' },
  { title: 'New & Popular', href: '/new' },
  { title: 'My List', href: '/my-list' },
];

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        bgcolor: scrolled ? 'rgba(20, 20, 20, 0.9)' : 'transparent',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Toolbar>
        {/* Netflix Logo */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            fontWeight: 900,
            color: 'error.main',
            textDecoration: 'none',
            letterSpacing: '1px',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            mr: 4
          }}
        >
          NETFLIX
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {NavItems.map((item) => (
            <Button
              key={item.title}
              component={Link}
              href={item.href}
              color="inherit"
              sx={{ 
                mx: 1, 
                fontWeight: pathname === item.href ? 'bold' : 'normal',
                opacity: pathname === item.href ? 1 : 0.7,
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        
        {/* Search */}
        <Box component="form" onSubmit={handleSearchSubmit}>
          <SearchWrapper>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Titles, people, genres…"
              inputProps={{ 'aria-label': 'search' }}
              className={searchOpen ? 'open' : ''}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => setSearchOpen(true)}
              onBlur={() => !searchQuery && setSearchOpen(false)}
            />
          </SearchWrapper>
        </Box>

        {/* Notifications */}
        <IconButton color="inherit">
          <Notifications />
        </IconButton>

        {/* User Profile */}
        <IconButton
          edge="end"
          aria-label="user account"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar 
            sx={{ width: 32, height: 32 }} 
            alt="User Profile" 
            src="/profile-placeholder.png" 
          />
          <ArrowDropDown />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Account</MenuItem>
          <MenuItem onClick={handleMenuClose}>Sign out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
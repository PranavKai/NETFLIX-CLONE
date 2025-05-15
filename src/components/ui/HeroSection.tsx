'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { PlayArrow, Info } from '@mui/icons-material';
import { Show } from '@/services/tvmaze-api';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  featuredShow: Show | null;
}

const HeroSection = ({ featuredShow }: HeroSectionProps) => {
  const router = useRouter();
  const [showSummary, setShowSummary] = useState('');

  useEffect(() => {
    if (featuredShow?.summary) {
      // Strip HTML tags from summary
      const strippedSummary = featuredShow.summary.replace(/<\/?[^>]+(>|$)/g, '');
      setShowSummary(strippedSummary);
    }
  }, [featuredShow]);

  if (!featuredShow) {
    return (
      <Box
        sx={{
          height: '70vh',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5">Loading featured content...</Typography>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '85vh' },
        color: 'common.white',
        mb: 4,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.4) 100%), url(${
          featuredShow.image?.original || 'https://via.placeholder.com/1280x720'
        })`,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 0,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '50%' },
            mt: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {featuredShow.name}
          </Typography>

          <Box sx={{ display: 'flex', mb: 2 }}>
            {featuredShow.rating?.average && (
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Rating: {featuredShow.rating.average}/10
              </Typography>
            )}
            {featuredShow.premiered && (
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {new Date(featuredShow.premiered).getFullYear()}
              </Typography>
            )}
            {featuredShow.status && (
              <Typography
                variant="subtitle1"
                sx={{
                  backgroundColor: 'secondary.main',
                  px: 1,
                  borderRadius: 1,
                }}
              >
                {featuredShow.status}
              </Typography>
            )}
          </Box>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            }}
          >
            {showSummary}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={() => router.push(`/watch/${featuredShow.id}`)}
              sx={{
                mr: 2,
                mb: { xs: 2, md: 0 },
                bgcolor: 'common.white',
                color: 'common.black',
                '&:hover': {
                  bgcolor: 'grey.300',
                },
              }}
            >
              Play
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Info />}
              onClick={() => router.push(`/shows/${featuredShow.id}`)}
              sx={{
                bgcolor: 'rgba(109, 109, 110, 0.7)',
                '&:hover': {
                  bgcolor: 'rgba(109, 109, 110, 0.9)',
                },
              }}
            >
              More Info
            </Button>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default HeroSection;
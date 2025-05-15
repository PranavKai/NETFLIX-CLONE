'use client';

import { useState, useRef } from 'react';
import { Box, Typography, IconButton, Card, CardMedia, CardContent } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Show } from '@/services/tvmaze-api';
import { useRouter } from 'next/navigation';

interface ShowsCarouselProps {
  title: string;
  shows: Show[];
}

const ShowsCarousel = ({ title, shows }: ShowsCarouselProps) => {
  const router = useRouter();
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!shows || shows.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4, position: 'relative', overflowX: 'hidden' }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2, 
          ml: 2, 
          fontWeight: 'bold',
          '&:hover': {
            color: 'grey.300',
          }
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => handleClick('left')}
          sx={{
            position: 'absolute',
            left: 0,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            visibility: !isMoved ? 'hidden' : 'visible'
          }}
        >
          <ChevronLeft sx={{ fontSize: 40 }} />
        </IconButton>

        <Box
          ref={rowRef}
          sx={{
            display: 'flex',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pl: 2,
            pb: 1,
          }}
        >
          {shows.map((show) => (
            <Card
              key={show.id}
              onClick={() => router.push(`/shows/${show.id}`)}
              sx={{
                minWidth: 200,
                width: 250,
                mx: 0.5,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderRadius: 1,
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  zIndex: 1,
                  '& .MuiCardContent-root': {
                    opacity: 1,
                  },
                },
                cursor: 'pointer',
              }}
            >
              <CardMedia
                component="img"
                image={show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image'}
                alt={show.name}
                sx={{
                  height: 140,
                  objectFit: 'cover',
                }}
              />
              <CardContent
                className="MuiCardContent-root"
                sx={{
                  p: 1,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <Typography variant="subtitle1" noWrap>{show.name}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {show.genres.slice(0, 2).map((genre) => (
                    <Typography
                      key={genre}
                      variant="caption"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        px: 0.5,
                        borderRadius: 0.5,
                      }}
                    >
                      {genre}
                    </Typography>
                  ))}
                  {show.rating?.average && (
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: 'secondary.main',
                        px: 0.5,
                        borderRadius: 0.5,
                      }}
                    >
                      {show.rating.average}/10
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <IconButton
          onClick={() => handleClick('right')}
          sx={{
            position: 'absolute',
            right: 0,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          }}
        >
          <ChevronRight sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ShowsCarousel;
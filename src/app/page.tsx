'use client';

import { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import HeroSection from '@/components/ui/HeroSection';
import ShowsCarousel from '@/components/shows/ShowsCarousel';
import NavBar from '@/components/layout/NavBar';
import TVMazeService, { Show } from '@/services/tvmaze-api';

export default function Home() {
  const [featuredShow, setFeaturedShow] = useState<Show | null>(null);
  const [trendingShows, setTrendingShows] = useState<Show[]>([]);
  const [dramaShows, setDramaShows] = useState<Show[]>([]);
  const [comedyShows, setComedyShows] = useState<Show[]>([]);
  const [sciFiShows, setSciFiShows] = useState<Show[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured shows (we'll use the first one as the hero)
        const featuredShows = await TVMazeService.getFeaturedShows();
        if (featuredShows.length > 0) {
          setFeaturedShow(featuredShows[0]);
          setTrendingShows(featuredShows);
        }

        // Fetch shows by genres
        const dramaShowsList = await TVMazeService.getShowsByGenre('Drama');
        setDramaShows(dramaShowsList.slice(0, 20));

        const comedyShowsList = await TVMazeService.getShowsByGenre('Comedy');
        setComedyShows(comedyShowsList.slice(0, 20));

        const sciFiShowsList = await TVMazeService.getShowsByGenre('Science-Fiction');
        setSciFiShows(sciFiShowsList.slice(0, 20));

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', color: 'text.primary' }}>
      <NavBar />
      
      {/* Hero Section */}
      <HeroSection featuredShow={featuredShow} />
      
      {/* Content Rows */}
      <Container maxWidth="xl" sx={{ mt: -10, position: 'relative', zIndex: 2 }}>
        <ShowsCarousel title="Trending Now" shows={trendingShows} />
        <ShowsCarousel title="Dramas" shows={dramaShows} />
        <ShowsCarousel title="Comedies" shows={comedyShows} />
        <ShowsCarousel title="Sci-Fi & Fantasy" shows={sciFiShows} />
      </Container>
    </Box>
  );
}

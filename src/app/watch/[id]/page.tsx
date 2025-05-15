'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import VideoPlayer from '@/components/shows/VideoPlayer';
import TVMazeService, { Show, Episode } from '@/services/tvmaze-api';

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const showId = typeof params.id === 'string' ? parseInt(params.id) : 0;
  const episodeId = searchParams.get('episode') ? parseInt(searchParams.get('episode') as string) : null;
  
  const [show, setShow] = useState<Show | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch show details
        const showData = await TVMazeService.getShowById(showId);
        if (!showData) {
          setError('Show not found');
          setLoading(false);
          return;
        }
        setShow(showData);
        
        // If episode ID is provided, fetch that specific episode
        if (episodeId) {
          const episodes = await TVMazeService.getEpisodes(showId);
          const selectedEpisode = episodes.find(ep => ep.id === episodeId);
          if (selectedEpisode) {
            setEpisode(selectedEpisode);
          } else {
            // If episode not found, just use the first episode
            setEpisode(episodes[0] || null);
          }
        } else {
          // If no episode ID, get the first episode
          const episodes = await TVMazeService.getEpisodes(showId);
          setEpisode(episodes[0] || null);
        }
        
      } catch (err) {
        console.error('Error loading watch page:', err);
        setError('Failed to load video content');
      } finally {
        setLoading(false);
      }
    };
    
    if (showId) {
      fetchData();
    }
  }, [showId, episodeId]);
  
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'black',
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }
  
  if (error || !show) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'black',
          color: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {error || 'Content not available'}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    );
  }
  
  // Note: In a real application, you would get the actual video URL from your API
  // Here we're using placeholder content
  const videoTitle = episode ? `${show.name}: ${episode.name}` : show.name;
  const thumbnailUrl = episode?.image?.original || show.image?.original;
  
  return (
    <Box sx={{ bgcolor: 'black', minHeight: '100vh' }}>
      <VideoPlayer
        title={videoTitle}
        // In a real app, you would get the actual video URL from your streaming service
        // videoUrl="https://your-streaming-service.com/videos/example.mp4"
        thumbnailUrl={thumbnailUrl}
        showId={showId}
      />
    </Box>
  );
}
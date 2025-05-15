'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  Rating,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { PlayArrow, Add } from '@mui/icons-material';
import NavBar from '@/components/layout/NavBar';
import ShowsCarousel from '@/components/shows/ShowsCarousel';
import TVMazeService, { Show, Episode } from '@/services/tvmaze-api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ShowDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const showId = typeof params.id === 'string' ? parseInt(params.id) : 0;
  
  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [similarShows, setSimilarShows] = useState<Show[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchShowDetails = async () => {
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
        
        // Fetch episodes
        const episodesData = await TVMazeService.getEpisodes(showId);
        setEpisodes(episodesData);
        
        // Fetch similar shows based on genre
        if (showData.genres.length > 0) {
          const genreShows = await TVMazeService.getShowsByGenre(showData.genres[0]);
          setSimilarShows(
            genreShows
              .filter(s => s.id !== showId) // Filter out current show
              .slice(0, 20) // Limit to 20 shows
          );
        }
      } catch (err) {
        console.error('Error fetching show details:', err);
        setError('Failed to load show details');
      } finally {
        setLoading(false);
      }
    };
    
    if (showId) {
      fetchShowDetails();
    }
  }, [showId]);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Group episodes by season
  const episodesBySeason: {[key: number]: Episode[]} = {};
  episodes.forEach(episode => {
    if (!episodesBySeason[episode.season]) {
      episodesBySeason[episode.season] = [];
    }
    episodesBySeason[episode.season].push(episode);
  });
  
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default'
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
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary'
        }}
      >
        <Typography variant="h5">{error || 'Show not found'}</Typography>
        <Button
          variant="outlined"
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    );
  }
  
  // Process show summary to remove HTML tags
  const summary = show.summary ? show.summary.replace(/<\/?[^>]+(>|$)/g, '') : '';
  
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', color: 'text.primary' }}>
      <NavBar />
      
      {/* Hero Section */}
      <Box
        sx={{
          pt: '64px',
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.4) 100%), url(${show.image?.original || 'https://via.placeholder.com/1280x720'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: '400px',
                  width: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0px 5px 15px rgba(0,0,0,0.5)',
                  position: 'relative',
                }}
              >
                <Image
                  src={show.image?.original || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={show.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 600px) 100vw, 400px"
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                {show.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {show.premiered && (
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    {new Date(show.premiered).getFullYear()}
                  </Typography>
                )}
                {show.rating?.average && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Rating
                      value={show.rating.average / 2}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {show.rating.average}/10
                    </Typography>
                  </Box>
                )}
                {show.status && (
                  <Chip
                    label={show.status}
                    color={show.status === 'Running' ? 'success' : 'default'}
                    size="small"
                  />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {show.genres.map((genre) => (
                  <Chip key={genre} label={genre} color="primary" variant="outlined" />
                ))}
              </Box>
              
              <Typography variant="body1" paragraph>
                {summary}
              </Typography>
              
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => router.push(`/watch/${showId}`)}
                  sx={{
                    bgcolor: 'secondary.main',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    },
                  }}
                >
                  Play
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Add />}
                >
                  My List
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Content Tabs */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tab label="Episodes" />
            <Tab label="More Info" />
            <Tab label="Related" />
          </Tabs>
          
          {/* Episodes Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 2 }}>
              {Object.keys(episodesBySeason).length > 0 ? (
                Object.keys(episodesBySeason).map((season) => (
                  <Box key={season} sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Season {season}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                      {episodesBySeason[parseInt(season)].map((episode) => (
                        <ListItem
                          key={episode.id}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.05)',
                            },
                            borderRadius: 1,
                            mb: 1,
                          }}
                          onClick={() => router.push(`/watch/${showId}?episode=${episode.id}`)}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {episode.number}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 2, sm: 1 }}>
                              {episode.image?.medium ? (
                                <Box sx={{ width: '40px', height: '30px', position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                                  <Image
                                    src={episode.image.medium}
                                    alt={episode.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                  />
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    width: '40px',
                                    height: '30px',
                                    bgcolor: 'grey.800',
                                    borderRadius: 1,
                                  }}
                                />
                              )}
                            </Grid>
                            <Grid size={{ xs: 9, sm: 10 }}>
                              <ListItemText
                                primary={episode.name}
                                secondary={
                                  episode.summary ? (
                                    episode.summary.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 100) + '...'
                                  ) : (
                                    'No description available'
                                  )
                                }
                              />
                            </Grid>
                          </Grid>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No episodes available
                </Typography>
              )}
            </Box>
          </TabPanel>
          
          {/* More Info Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body2">
                        {show.status || 'Unknown'}
                      </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Network
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body2">
                        {show.network?.name || 'Unknown'}
                      </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Premiered
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body2">
                        {show.premiered || 'Unknown'}
                      </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Genres
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography variant="body2">
                        {show.genres.join(', ') || 'None listed'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    Rating & Info
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {show.rating?.average && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                        <CircularProgress
                          variant="determinate"
                          value={(show.rating.average / 10) * 100}
                          size={60}
                          thickness={5}
                          color="secondary"
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="body2" component="div" color="text.secondary">
                            {show.rating.average}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2">
                        User Rating ({show.rating.average}/10)
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography variant="body2" paragraph>
                    {summary || 'No description available'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
          
          {/* Related Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 2 }}>
              {similarShows.length > 0 ? (
                <ShowsCarousel title="You might also like" shows={similarShows} />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No related shows found
                </Typography>
              )}
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
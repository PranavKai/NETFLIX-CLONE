'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Slider, Typography, Paper, Alert } from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  ArrowBack,
} from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/navigation';

interface VideoPlayerProps {
  title: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  showId: number;
}

const VideoPlayer = ({ title, videoUrl, thumbnailUrl, showId }: VideoPlayerProps) => {
  const router = useRouter();
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Demo video samples - in a real app, you would get these from your streaming service API
  const demoVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  ];

  // Select a video based on the showId to have some variety
  const videoSrc = videoUrl || demoVideos[showId % demoVideos.length];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setPlaying(!playing);
        e.preventDefault();
      } else if (e.code === 'ArrowRight') {
        playerRef.current?.seekTo((playerRef.current?.getCurrentTime() || 0) + 10);
        e.preventDefault();
      } else if (e.code === 'ArrowLeft') {
        playerRef.current?.seekTo((playerRef.current?.getCurrentTime() || 0) - 10);
        e.preventDefault();
      } else if (e.code === 'Escape' && isFullScreen) {
        document.exitFullscreen().catch((err) => console.error('Error exiting fullscreen:', err));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playing, isFullScreen]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    setMuted(newValue === 0);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleSeekChange = (_event: Event, newValue: number | number[]) => {
    setPlayed(newValue as number);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) => {
    setSeeking(false);
    playerRef.current?.seekTo(newValue as number);
  };

  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleFullscreenToggle = () => {
    if (isFullScreen) {
      document.exitFullscreen().catch((err) => console.error('Error exiting fullscreen:', err));
    } else if (containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => console.error('Error entering fullscreen:', err));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : 0;
  const duration = playerRef.current ? playerRef.current.getDuration() : 0;

  return (
    <Paper
      ref={containerRef}
      elevation={3}
      sx={{
        position: 'relative',
        width: '100%',
        height: isFullScreen ? '100%' : '100vh',
        bgcolor: 'black',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 0,
          right: 0,
          zIndex: 2,
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton 
            onClick={() => router.push(`/shows/${showId}`)}
            sx={{ color: 'white', mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'white' }}>
            {title}
          </Typography>
        </Box>
        
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2, 
            background: 'rgba(13, 60, 97, 0.7)', 
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          This is a demo app using placeholder videos. In a real Netflix clone, each show would have its own video content.
        </Alert>
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          bgcolor: 'black',
          pt: 12, // Add padding to accommodate the title and alert
        }}
        onClick={handlePlayPause}
      >
        <ReactPlayer
          ref={playerRef}
          url={videoSrc}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          progressInterval={1000}
          light={!playing && thumbnailUrl}
          style={{ position: 'absolute', top: 0, left: 0 }}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true,
              },
            },
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          transition: 'opacity 0.3s',
          opacity: 1,
          '&:hover': {
            opacity: 1,
          },
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ width: '100%', mb: 1 }}>
          <Slider
            value={played}
            onChange={handleSeekChange}
            onMouseDown={handleSeekMouseDown}
            onChangeCommitted={handleSeekMouseUp}
            min={0}
            max={0.999999}
            step={0.000001}
            sx={{
              color: 'secondary.main',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                transition: '0.3s',
                '&:hover, &.Mui-active': {
                  width: 16,
                  height: 16,
                },
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', width: 200, mx: 2 }}>
              <IconButton onClick={handleToggleMute} sx={{ color: 'white' }}>
                {muted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.01}
                sx={{
                  color: 'white',
                  ml: 2,
                  width: 100,
                }}
                size="small"
              />
            </Box>

            <Typography variant="body2" sx={{ color: 'white' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>

          <IconButton onClick={handleFullscreenToggle} sx={{ color: 'white' }}>
            <Fullscreen />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default VideoPlayer;
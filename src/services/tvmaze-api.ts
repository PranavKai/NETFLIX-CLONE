import axios from 'axios';

// Base URL for TVMaze API - use environment variable if available
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tvmaze.com';

// Interface for Show data
export interface Show {
  id: number;
  name: string;
  summary: string;
  image?: {
    medium?: string;
    original?: string;
  };
  genres: string[];
  rating?: {
    average?: number;
  };
  premiered?: string;
  status?: string;
  network?: {
    name?: string;
  };
}

// Interface for Episode data
export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  summary: string;
  image?: {
    medium?: string;
    original?: string;
  };
  runtime: number;
  airdate: string;
  url: string;
}

// Interface for Search Result
export interface SearchResult {
  show: Show;
  score: number;
}

// TVMaze API Service
const TVMazeService = {
  // Get featured shows (based on popular shows)
  getFeaturedShows: async (): Promise<Show[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shows`);
      return response.data.slice(0, 10); // Return top 10 shows
    } catch (error) {
      console.error('Error fetching featured shows:', error);
      return [];
    }
  },

  // Search shows by query
  searchShows: async (query: string): Promise<Show[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
      return response.data.map((result: SearchResult) => result.show);
    } catch (error) {
      console.error('Error searching shows:', error);
      return [];
    }
  },

  // Get show details by ID
  getShowById: async (id: number): Promise<Show | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shows/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching show with ID ${id}:`, error);
      return null;
    }
  },

  // Get episodes for a show
  getEpisodes: async (showId: number): Promise<Episode[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shows/${showId}/episodes`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching episodes for show with ID ${showId}:`, error);
      return [];
    }
  },

  // Get shows by genre
  getShowsByGenre: async (genre: string): Promise<Show[]> => {
    try {
      // TVMaze API doesn't have direct endpoint for filtering by genre
      // So we fetch all shows and filter on the client-side
      const response = await axios.get(`${API_BASE_URL}/shows`);
      return response.data.filter((show: Show) => 
        show.genres.some(g => g.toLowerCase() === genre.toLowerCase())
      );
    } catch (error) {
      console.error(`Error fetching shows with genre ${genre}:`, error);
      return [];
    }
  },
  
  // Get recent episodes
  getRecentEpisodes: async (): Promise<Episode[]> => {
    try {
      // Get episodes aired in the last week
      const date = new Date();
      date.setDate(date.getDate() - 7);
      const formattedDate = date.toISOString().split('T')[0];
      
      const response = await axios.get(`${API_BASE_URL}/schedule?date=${formattedDate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent episodes:', error);
      return [];
    }
  },
};

export default TVMazeService;
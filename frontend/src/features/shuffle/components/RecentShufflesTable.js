import { Box, Typography, Stack, Chip, Avatar } from '@mui/material';
import SidebarCard from './SidebarCard';

const RecentShufflesTable = ({ recentShuffles }) => {
  if (!recentShuffles || recentShuffles.length === 0) {
    return <></>;
  }

  // Sort shuffles by most recent first
  const sortedShuffles = [...recentShuffles].sort(
    (a, b) => new Date(b.shuffled_at["$date"]) - new Date(a.shuffled_at["$date"])
  );

  // Get playlist image URL if available
  const getPlaylistImage = (shuffle) => {
    return shuffle.playlist_image_url || null;
  };

  // Format date with relative time up to last week, then day/month/year
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp["$date"]) return "";

    const dateObj = new Date(timestamp["$date"]);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const shuffleDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    
    const diffTime = today - shuffleDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

    if (diffDays === 0) {
      // Today: just show time
      return timeStr;
    } else if (diffDays === 1) {
      // Yesterday
      return `Yesterday, ${timeStr}`;
    } else if (diffDays <= 7) {
      // This week: show relative days
      return `${diffDays} days ago`;
    } else {
      // Last week and older: show day/month/year
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
  };

  return (
    <SidebarCard>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white', 
            fontSize: '1.1rem', 
            fontWeight: 600,
            mb: 1.5,
            letterSpacing: '0.01em',
            textAlign: 'center'
          }}
        >
          Recent Shuffles
        </Typography>
        <Stack 
          spacing={0.75} 
          sx={{ 
            maxHeight: 250, 
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#222',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#555',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#666',
            },
          }}
        >
          {sortedShuffles.map((shuffle, index) => {
            const playlistImage = getPlaylistImage(shuffle);
            return (
              <Box
                key={index}
                sx={{
                  px: 1,
                  py: 0.75,
                  bgcolor: '#444',
                  borderRadius: 1,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: '#4a4a4a',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, flex: 1, minWidth: 0, alignItems: 'flex-start' }}>
                    {playlistImage && (
                      <Avatar
                        src={playlistImage}
                        alt={shuffle.playlist_name}
                        variant="rounded"
                        sx={{
                          width: 40,
                          height: 40,
                          flexShrink: 0,
                          bgcolor: '#555',
                        }}
                      />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 0.25,
                          width: '100%',
                          textAlign: 'left',
                        }}
                      >
                        {shuffle.playlist_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#aaa',
                          fontSize: '0.75rem',
                          textAlign: 'left',
                        }}
                      >
                        {formatDate(shuffle.shuffled_at)}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={shuffle.tracks_shuffled}
                    size="small"
                    sx={{
                      bgcolor: '#555',
                      color: 'white',
                      fontSize: '0.7rem',
                      height: '20px',
                      flexShrink: 0,
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </SidebarCard>
  );
};

export default RecentShufflesTable;

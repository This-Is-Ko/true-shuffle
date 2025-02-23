import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const RecentShufflesTable = ({ recentShuffles }) => {
  if (!recentShuffles || recentShuffles.length === 0) {
    return <></>;
  }

  // Column order, excluding 'duration_seconds'
  const columnOrder = ['shuffled_at', 'playlist_name', 'tracks_shuffled'];

  // Sort shuffles by most recent first
  const sortedShuffles = [...recentShuffles].sort(
    (a, b) => new Date(b.shuffled_at["$date"]) - new Date(a.shuffled_at["$date"])
  );

  // Display time only if current day otherwise both date and time
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp["$date"]) return "";

    const dateObj = new Date(timestamp["$date"]);
    const today = new Date();

    // Extract date parts for comparison
    const isToday =
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear();

    // Format date and time
    const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = dateObj.toLocaleDateString();

    return isToday ? timeStr : `${dateStr} ${timeStr}`;
  };

  return (
    <Box sx={{ 
      paddingTop: 4, 
      maxWidth: { xs: "80%", md: 600, },
      mx: 'auto',
    }}>
      <Paper elevation={3} sx={{ p: 1, bgcolor: '#333' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          Recent Shuffles
        </Typography>
        <TableContainer sx={{ maxHeight: 130, overflowY: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columnOrder.map((col) => (
                  <TableCell 
                    key={col} 
                    sx={{
                      py: 0.5, 
                      px: 1, 
                      bgcolor: '#444', 
                      color: 'white', 
                      borderBottom: '2px solid #555',
                      display: col === 'tracks_shuffled' ? { xs: 'none', sm: 'table-cell' } : 'table-cell',  // Hide on small screens
                    }}
                  >
                    <strong>{col.replace(/_/g, ' ').toUpperCase()}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedShuffles.map((shuffle, index) => (
                <TableRow key={index} hover sx={{ bgcolor: index % 2 === 0 ? '#444' : '#555' }}>
                  {columnOrder.map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        py: 0.5,
                        px: 1,
                        color: 'white',
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: col === "playlist_name" ? "200px" : "unset",
                        display: col === 'tracks_shuffled' ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                      }}
                    >
                      {col === "shuffled_at"
                      ? formatDate(shuffle[col])
                      : shuffle[col]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Typography variant="subtitle2" sx={{ color: 'grey' }}>
          Quick selection of recent playlists
        </Typography> */}
      </Paper>
    </Box>
  );
};

export default RecentShufflesTable;

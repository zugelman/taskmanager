import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" py={3}>
    <CircularProgress />
  </Box>
);

export default Loader; 
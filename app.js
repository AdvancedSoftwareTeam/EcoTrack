const express = require('express');
const app = express();
const reportRoutes = require('./routes/reportRoutes');

// Other configurations and middleware...

// Use reportRoutes
app.use('/api', reportRoutes);

// Other routes...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const sessionConfig = require('./middlewares/sessionConfig'); // Import the session configuration module

const app = express();
app.use(express.json());
app.use(sessionConfig); // Apply the session configuration

// Define all routers
const userRouter = require('./routes/userRoutes');
// const dataRouter = require('./routes/dataRoutes');
// const alertsRouter = require('./routes/alertsRoutes');
// const reportsRouter = require('./routes/reportsRoutes');
// const scoresRouter = require('./routes/scoresRoutes');
// const resourcesRouter = require('./routes/resourcesRoutes');
// const openDataRouter = require('./routes/open-dataRoutes');
// const externalAPIRouter = require('./routes/external-apiRoutes');

// Use the routers
app.use('/api/users', userRouter);
// app.use('/api/data', dataRouter);
// app.use('/api/alerts', alertsRouter);
// app.use('/api/reports', reportsRouter);
// app.use('/api/scores', scoresRouter);
// app.use('/api/resources', resourcesRouter);
// app.use('/api/open-data', openDataRouter);
// app.use('/api/external-api', externalAPIRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = app;

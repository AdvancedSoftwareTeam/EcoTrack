const express = require('express');
const app = express();

// Define all routers
const userRouter = require('./routes/userRoutes');
const dataRouter = require('./routes/dataRoutes');
const alertsRouter = require('./routes/alertsRoutes');
const reportsRouter = require('./routes/reportsRoutes');
const scoresRouter = require('./routes/scoresRoutes');
const resourcesRouter = require('./routes/resourcesRoutes');
const openDataRouter = require('./routes/open-dataRoutes');
const externalAPIRouter = require('./routes/external-apiRoutes');

// If we need to add middlewares they go here
//

// Use the routers
app.use('/api/users', userRouter);
app.use('/api/data', dataRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/open-data', openDataRouter);
app.use('/api/external-api', externalAPIRouter);

module.exports = app;

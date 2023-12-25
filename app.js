/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const sessionConfig = require('./middlewares/sessionConfig'); // Import the session configuration module
const http =require("http")
const {Server}=require("socket.io")
const app = express();
const server =http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(sessionConfig); // Apply the session configuration
//
// Define all routersm
const userRouter = require('./routes/userRoutes');
const dataRouter = require('./routes/dataRoutes');
const alertsRouter = require('./routes/alertsRoutes');
const reportsRouter = require('./routes/reportsRoutes');
// const scoresRouter = require('./routes/scoresRoutes');
// const resourcesRouter = require('./routes/resourcesRoutes');
const openDataRouter = require('./routes/open-dataRoutes');
const { addUserSocket,notifyUser,removeUserSocket } = require('./services/SocketService');
// const externalAPIRouter = require('./routes/external-apiRoutes');

// Use the routers
app.use('/api/users', userRouter);
app.use('/api/data', dataRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/reports', reportsRouter);
// app.use('/api/scores', scoresRouter);
// app.use('/api/resources', resourcesRouter);
app.use('/api/open-data', openDataRouter);
// app.use('/api/external-api', externalAPIRouter);



io.on('connection', (socket) => {
  
  console.log('A user connected');
  socket.on("login",(data)=>{
    addUserSocket(data,socket);
    notifyUser(data,"test notify")
  });
  
  
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
    removeUserSocket(socket);
});}
)
server.listen(3000, '0.0.0.0', () =>
  console.log(" Server ready at: http://localhost:3000")
);

module.exports = app;


const express = require('express');

const PostsRouter = require('./routers/postsRouter');

const server = express();

server.use(express.json());
server.use('/api/posts', PostsRouter)

server.get('/', (req, res) => {
  res.send(`
    <h2>Random LOTR posts API</h>
  `);
});

module.exports = server;
const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const path = require('path');
const livereload = require('livereload');
const livereloadMiddleware = require('connect-livereload');
const mainRouter = require('./routes');
const searchRouter = require('./routes/search'); 

const liveServer = livereload.createServer({
    exts : ['html', 'css', 'js'],
    debug : true
});
liveServer.watch(__dirname);


app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')))
app.use(livereloadMiddleware());
app.use('/search', searchRouter);

app.get('/', mainRouter);

app.listen(port, () => {
  console.log('Open Success');
});
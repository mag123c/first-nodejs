const express = require('express');
const app = express();
const port = 8080;
const path = require('path');

const cors = require('cors');
app.use(cors());

const livereload = require('livereload');
const livereloadMiddleware = require('connect-livereload');
const liveServer = livereload.createServer({
  exts : ['html', 'css', 'js'],
  debug : true
});
liveServer.watch(__dirname);
app.use(livereloadMiddleware());

const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', './public/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')))

const mainRouter = require('./routes');
const searchRouter = require('./routes/search');
app.all('/search', searchRouter);
app.get('/', mainRouter);

app.listen(port, () => {
  console.log('Open Success');
});
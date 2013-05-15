
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , room=require('./routes/room')
  , fileupload=require('./routes/fileupload')
  ,constant=require('./routes/util/Constant')

  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || constant.DomainPort);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', require('ejs').renderFile);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ keepExtensions: true, uploadDir:__dirname+'/public/upload/' }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', room.get);

app.get('/static/:id',routes.sta);

app.post('/room',room.add);
app.post('/roomup',room.tableupate);

app.get('/room/:id',room.getById);
app.post('/user',user.add);
app.post('/fileupload',fileupload.upload);
app.post('/userRp',user.checkUsername);
app.post('/content',user.contentAdd);
app.get('/content/*/*/*',user.getContent);
var server=http.createServer(app).listen(app.get('port'), function(){

  console.log("Express server listening on port " + app.get('port'));

});


var ioCallback=require("./routes/util/socketUtil");

ioCallback.init(server);

process.on('uncaughtException', function(e) {
    　console.log(e);
});

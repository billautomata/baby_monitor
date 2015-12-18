// https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04
// openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt

var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express');

var request = require('request')
var mjpegconsumer = require('mjpeg-consumer')
var Stream = require('stream')

var consumer = new mjpegconsumer()

var USERNAME = process.env.WEBCAM_USERNAME
var PASSWORD = process.env.WEBCAM_PASSWORD
var HOST = process.env.WEBCAM_HOST

var jpg_parser = new Stream.Writable({
  write: function(chunk, encoding, next){
    console.log('chunk', chunk.length)
    console.log(chunk.toString('hex').substring(0,100))
    next()
  }
})

// request(['http://',USERNAME,':',PASSWORD,'@',HOST,'/video/mjpg.cgi'].join(''))
//   .pipe(consumer).pipe(jpg_parser)

var bytes = new Buffer(1)

var audio_parser = new Stream.Writable({
  write: function(chunk, encoding, next){
    if(bytes.length < 1024*20){
      bytes = Buffer.concat([chunk,bytes])
      console.log(bytes.length)
    }

    // console.log('chunk', chunk.length)
    // console.log(chunk.toString('hex').substring(0,100))
    next()
  }
})

request(['http://',USERNAME,':',PASSWORD,'@',HOST,'/audio.cgi'].join(''))
  .pipe(audio_parser)

var port = 8000;

var options = {
  key: fs.readFileSync('./nginx.key'),
  cert: fs.readFileSync('./nginx.crt'),
  requestCert: false,
  rejectUnauthorized: false
};

var app = express();

var server

// console.log(process.env)

if(process.env.HTTPS && process.env.HTTPS === '1'){
  server = https.createServer(options, app).listen(port, function(){
    console.log("Express _SECURE_ server listening on port " + port);
  });
} else {
  server = http.createServer(app).listen(port, function(){
    console.log("Express server listening on port " + port);
  });
}
//
// var server = http.createServer(app).listen(port, function(){
//   console.log("Express server listening on port " + port);
// });

// app.get('/', function (req, res) {
//     res.writeHead(200);
//     res.end("hello world\n");
// });

app.get('/audio.wav', function(req,res){
  res.writeHead(200)
  // res.send(bytes)
  res.end(bytes)
})

app.use(express.static(__dirname + '/public'))

// https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04
// openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt

var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express');

var assert = require('assert')

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

var bytes = -1
var p = 0

var audio_parser = new Stream.Writable({
  write: function(chunk, encoding, next){

    p += 1
    // console.log(p)
    if(bytes === -1){
      console.log(chunk.length,'chunk length')
      bytes = chunk
      parse_header(bytes)
    } else {
      // parse_header(chunk)
      parse_samples(chunk)
    }
    // console.log('chunk', chunk.length)
    // console.log(chunk.toString('hex').substring(0,100))
    next()
  }
})

function parse_header(buffer){
  console.log('buffer length', buffer.length)
  assert.equal('RIFF', buffer.slice(0,4).toString(), 'Bytes 0 - 4 | RIFF header correct')
  console.log('chunk', buffer.slice(0,4).toString())
  console.log('chunksize', buffer.slice(4,8).readUInt32LE())
  console.log('format', buffer.slice(8,12).toString())
  console.log('subchunk1ID', buffer.slice(12,16).toString())
  console.log('subchunk1size', buffer.slice(16,20).readUInt32LE())
  console.log('AudioFormat', buffer.slice(20,22).readUInt16LE())
  console.log('Num Channels', buffer.slice(22,24).readUInt16LE())
  console.log('Sample Rate', buffer.slice(24,28).readUInt32LE())
  console.log('Byte Rate', buffer.slice(28,32).readUInt32LE())
  console.log('BlockAlign', buffer.slice(32,34).readUInt16LE())
  console.log('BitsPerSample', buffer.slice(34,36).readUInt16LE())
  console.log('Subchunk2ID', buffer.slice(36,40).toString())
  console.log('Subchunk2Size', buffer.slice(40,44).readUInt32LE())

}

function parse_samples(buffer){
  var offset = 0
  var bytes_per_sample = 2
  for(var i = 0; i < 8; i++){
    var b = offset+(i* bytes_per_sample)
    var e = b + bytes_per_sample
    // range from -32768 to 32767
    console.log('sample',i,buffer.slice(b,e).readInt16LE())
  }
}

// start audio parser by kicking off the request
request(['http://',USERNAME,':',PASSWORD,'@',HOST,'/audio.cgi?type=PCM'].join('')).pipe(audio_parser)

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

# baby monitor

`npm install`

`npm run create_keys`

`npm run https`

or

`npm run http`



# how does it work?

* browser application
  * tracks motion from IP camera source
  * tracks audio levels


# todo

* [ ] streams audio samples and video images to database for replay & reconstruction

http://ip/audio.cgi - 8000hz 16bit LE mono PCM
http://ip/video.cgi - 640x480 MJPG

```javascript
var r = require('request')
var m = require('mjpeg-consumer')
var c = new m()
r('http://ip/video.cgi').pipe(c).pipe(new require('stream').Writable({write: function(chunk,encoding,next){ console.log(chunk.length, encoding); next(); }}))
```

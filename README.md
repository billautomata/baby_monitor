# baby monitor

`ip camera` > `node.js server` > `browser`

`npm install`

`npm run create_keys`

`npm run https`

or

`npm run http`


# todo

* pass raw audio samples to browser and use `decodeAudioData` to perform the resampling [link](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData)
* streams audio samples and video images to database for replay & reconstruction

`raw PCM data` > `decodeAudioData` > `scriptProcessorNode`

# notes
* http://ip/audio.cgi - 8000hz 16bit LE mono PCM
* http://ip/video.cgi - 640x480 MJPG


```javascript
// how to output jpegs
var r = require('request')
var m = require('mjpeg-consumer')
var c = new m()
r('http://ip/video.cgi').pipe(c).pipe(new require('stream').Writable({write: function(chunk,encoding,next){ console.log(chunk.length, encoding); next(); }}))
```

* curl http://user:pass@ip/audio.cgi?type=PCM | play -t wav -r 8000 -b 16 -L -

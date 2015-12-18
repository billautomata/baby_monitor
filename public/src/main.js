console.log(Date.now())
console.log('hello from main.js')

var d3 = window.d3

d3.select('img#main_img').on('load', function () {
  console.log('lol')
  d3.select('img#main_img').attr('src', 'https://192.168.0.105/image.jpg?cidx=' + String(Math.random()))
// window.requestAnimationFrame(loader)
})

// function loader () {
//   // console.log('loader')
// }
// loader()

;(function create_canvas_element () {})()
;(function setup_audio_context () {})()
;(function get_video_levels () {
  // read new image
  //
})()
;(function get_levels () {})()

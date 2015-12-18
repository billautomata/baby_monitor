(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1]);

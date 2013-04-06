requestAnimationFrame = window.requestAnimationFrame or window.window.webkitRequestAnimationFrame

$ ->
  new TWEEN.Tween(
    x: 0
    y: 0
    z: 0
  ).to(
    x: -7
    y: -6
    z: 437
  , 1000).onUpdate(->
    $(".road").css "-webkit-transform", "translate3d(" + @x + "%, " + @y + "px, " + @z + "px)"
    !0
  )#.start()

  animate()


animate = ->
  requestAnimationFrame animate
  TWEEN.update()


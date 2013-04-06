var animate, requestAnimationFrame;

requestAnimationFrame = window.requestAnimationFrame || window.window.webkitRequestAnimationFrame;

$(function() {
  new TWEEN.Tween({
    x: 0,
    y: 0,
    z: 0
  }).to({
    x: -7,
    y: -6,
    z: 437
  }, 1000).onUpdate(function() {
    $(".road").css("-webkit-transform", "translate3d(" + this.x + "%, " + this.y + "px, " + this.z + "px)");
    return !0;
  });
  return animate();
});

animate = function() {
  requestAnimationFrame(animate);
  return TWEEN.update();
};

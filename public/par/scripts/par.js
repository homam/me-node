var isMobile = $(window).width() < 500;

if(isMobile) {
    $(document.body).addClass("mobile")
}

$("article").on("scroll", function(e) {

    var $win = $(this);
    var scroll = $win.scrollTop()

   $("section h3").css("-webkit-transform", "translate3d(-1em," + (scroll/3) +"px,0) rotateZ(90deg)")
   $("section").each(function() {
       var $this = $(this);
      //console.log($this, $this.offset())
   });
});

Hammer(document.body).on("swipeup", function(){
    console.log("sup");
})




var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

var camera, scene, renderer, parent;
var geometry, material, mesh;
var target = new THREE.Vector3();

var lon = 180, lat = 0;
var phi = 0, theta = 0;

var touchX, touchY;


init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );
    scene = new THREE.Scene();

    var parentEl = document.getElementById("viewport");
    parent = new THREE.CSS3DObject(parentEl);
    scene.add(parent);

   $("section").map(function(i, esec) {
       // esec: <section>
       esec.width = 1026; // 2 pixels extra to close the gap.
       var object = new THREE.CSS3DObject( esec );

       var pos = JSON.parse(this.dataset.pos);
       var rot = JSON.parse(this.dataset.rot);
       object.position = new THREE.Vector3(pos[0], pos[1], pos[2]).multiplyScalar(512);
       object.rotation = new THREE.Vector3(rot[0], rot[1], rot[2]).multiplyScalar(Math.PI);

       var look = JSON.parse(this.dataset.lookAt);

       var id = this.id;
       window['goto' +id.toUpperCase()] = function() {
           lookAt(look[0], look[1],1000,TWEEN.Easing.Quadratic.InOut,false);

           console.log(parent.position.x, pos[0]);
           var f = function(pos){
               return Math.abs(pos) > 1 ? pos-1 : 0;
           };
           new TWEEN.Tween({x:parent.position.x}).to({x:-(f(pos[0]) * 512)},1000)
               .onUpdate(function() { parent.position.setX(this.x); })
               .start();

       };

       Hammer(esec).on('doubletap', function(event){
           lookAt(look[0], look[1],1000,TWEEN.Easing.Quadratic.InOut,true);
       });

       return object;
    }).forEach(function(obj) {
        parent.add(obj);
    });

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    Hammer(document.body).on('transform', function(){
       console.log("transform", arguments)
    });
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );

}

function onDocumentMouseMove( event ) {

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;


    //lon -= movementX * 0.1;
    //lat += movementY * 0.1;

    TWEEN.removeAll();
    var ratio = 1;
    var duration = 400;
    new TWEEN.Tween( {lon:lon, lat: lat} )
        .to( { lon:(lon-movementX)*ratio , lat: (lat+movementY)*ratio  }, Math.random() * duration + duration )
        .onUpdate(function () {
            lon = this.lon;
            lat = this.lat;
        })
        .easing( TWEEN.Easing.Quadratic.Out )
        .start();

}

function onDocumentMouseUp( event ) {

    document.removeEventListener( 'mousemove', onDocumentMouseMove );
    document.removeEventListener( 'mouseup', onDocumentMouseUp );

}

function onDocumentMouseWheel( event ) {

    camera.fov -= event.wheelDeltaY * 0.05;
    camera.updateProjectionMatrix();

}

function onDocumentTouchStart( event ) {
    var etarget = event.target;
    if(!!etarget && "A" ==  etarget.tagName)
        return;


    event.preventDefault();

    var touch = event.touches[ 0 ];

    touchX = touch.screenX;
    touchY = touch.screenY;

}

function onDocumentTouchMove(event) {

    event.preventDefault();

    var touch = event.touches[ 0 ];

    // without animation:
    //lon -= ( touch.screenX - touchX ) * 0.1;
    //lat += ( touch.screenY - touchY ) * 0.1;

    TWEEN.removeAll();

    var ratio = 3;

    lookAt(lon-( touch.screenX - touchX ) * ratio,
           lat+( touch.screenY - touchY ) * ratio, 400, TWEEN.Easing.Quadratic.Out);

    touchX = touch.screenX;
    touchY = touch.screenY;
}


// rotates the camera to final_lon and final_lat
// returns Tween object
var lookAt = function (flon, flat, duration, easing, fastestPath)  {
    if('undefined' ===  typeof duration )
        duration = 1000;

    if('undefined' === typeof easing)
        easing = TWEEN.Easing.Quadratic.InOut;

    if(!!fastestPath) {
        var deltaLon1 = (Math.floor(Math.abs(flon - lon) / 360) * 360 * ((lon-flon) > 0 ?1 :-1));
        var deltaLon2 = (Math.ceil(Math.abs(flon - lon) / 360) * 360 * ((lon-flon) > 0 ?1 :-1));

        flon += Math.abs(flon+deltaLon1) > Math.abs(flon+deltaLon2) ?deltaLon2 : deltaLon1; //(Math.floor(Math.abs(flon - lon) / 360) * 360 * ((lon-flon) > 0 ?1 :-1));
        flat += (Math.floor(Math.abs(flat - lat) / 90) * 90 * ((lat - flat) >0 ? 1:-1));
    }


    return new TWEEN.Tween( {lon:lon, lat: lat} )
            .to( { lon: flon, lat: flat }, Math.random() * duration + duration )
            .onUpdate(function () {
                lon = this.lon;
                lat = this.lat;
            })
            .easing(easing)
            .start();
}

function animate() {

    requestAnimationFrame( animate );

    TWEEN.update();


    //lon +=  0.1;
    lat = Math.max( - 89, Math.min( 89, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );

    target.x = Math.sin( phi ) * Math.cos( theta );
    target.y = Math.cos( phi );
    target.z = Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( target );

    renderer.render( scene, camera );

}

function rotateParent() {
    var target = new THREE.Vector3(1,1,0);
    var duration = 1000;
    var obj = scene.children[0];

    t = new TWEEN.Tween( obj.rotation )
        .to( { x: target.x, y: target.y, z: target.z }, Math.random() * duration + duration )
        .onStart (function () {
        console.log("start")
    })
        .onUpdate(function () {
            console.log(this);
        })
        .onComplete(function () {

        })
        .easing( TWEEN.Easing.Quadratic.InOut )
        .start();
}
var camera, scene, renderer, posParent, rotParent;
var geometry, material, mesh;
var target = new THREE.Vector3(0,0,0);

var posScale = 200;

var lon = 0, lat = 0;
var phi = 0, theta = 0;

var allBoards = {};
var currentBoard = null;

function gotoBoard(id) {
    if(!!currentBoard){
        currentBoard.unreveal();
    }
    var board = allBoards[id];
    if(!!board && board.gotoAndReveal) {
        board.gotoAndReveal();
        currentBoard = board;
        return true;
    }

    currentBoard = null;
    return false;
}


init();
animate();


function init() {

    hideAddressBar();

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );
    scene = new THREE.Scene();


    rotParent = new THREE.CSS3DObject(document.getElementById("viewport-rot"));
    posParent = new THREE.CSS3DObject(document.getElementById("viewport-pos"));
    rotParent.add(posParent)
    scene.add(rotParent);

    var addObject = function(element, pos, rot) {

        var object = new THREE.CSS3DObject( element );

        object.rotation = new THREE.Vector3(rot[0], rot[1], rot[2]).multiplyScalar(Math.PI);
        object.position = new THREE.Vector3(pos[0],pos[1],pos[2]).multiplyScalar(posScale);

        posParent.add(object);

        return object;
    };


    $("#viewport-pos").children().forEach(function(e) {
        var obj = addObject(e, JSON.parse(e.dataset.pos), JSON.parse(e.dataset.rot));
        allBoards[e.id] = new (function(o,e) {
            this.obj = o;

            var year = +e.id.slice(1);

            if(!e.dataset.goto)
                return;
            var goto = JSON.parse(e.dataset.goto);
            var epos = new THREE.Vector3(goto[0][0],goto[0][1],goto[0][2]).multiplyScalar(posScale);
            var erot = new THREE.Vector3(goto[1][0],goto[1][1],goto[1][2]).multiplyScalar(Math.PI);

            if(!e.dataset.rpos)
                return;

            var irot = obj.rotation.clone();
            var ipos = obj.position.clone();

            var dpos = JSON.parse(e.dataset.rpos);
            var drot = JSON.parse(e.dataset.rrot);
            var rpos = new THREE.Vector3(dpos[0],dpos[1],dpos[2]).multiplyScalar(posScale);
            var rrot = new THREE.Vector3(drot[0],drot[1],drot[2]).multiplyScalar(Math.PI);
            this.gotoAndReveal = function() {
                $("body").attr("data-year", year);
                window.goto(epos,erot);
                window.updateObject(this.obj,rpos,rrot);
            };
            this.unreveal = function() {
                window.updateObject(this.obj,ipos, irot);
            };

        })(obj,e);


    });


    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    Hammer(document.body).on("swipeleft", function(){
        var year = +document.body.dataset.year;
        var next = !year ? $("#y2002") : $("#y" +year).next();
        if(!next.length) return;
        gotoBoard(next[0].id);
    });

    Hammer(document.body).on("swiperight", function(){
        var year = +document.body.dataset.year;
        if(!year) return;
        var prev =  $("#y" +year).prev();
        if(!prev) return;
        var gone= gotoBoard(prev[0].id);
        if(!gone) {
          document.body.dataset.year = null;
          goto(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));
        }
    });

    var $timeline = $("#timeline");
    var height = (10.25*posScale)/(2015-2000);
    for(var y = 2015; y>=2000;y--) {
        var $year = $("<div class='year'></div>").html(y)//.css("-webkit-transform","translate3d(0,1000px,10px)");
            .css("bottom", (y-2000)*height);
        $year.appendTo($timeline);
    }

}

goto2013_ = function() {
    $("body").attr("data-year",2013);
    var ipos = posParent.position;
    var irot = rotParent.rotation;
    console.log({x: -1200, y: -80, z: 40,rx: 0, ry:Math.PI *.3, rz:0});
    new TWEEN.Tween({x:ipos.x,y:ipos.y,z:ipos.x,rx:irot.x, ry:irot.y, rz: irot.z})
        .to({x: -1200, y: -80, z: 40,rx: 0, ry:Math.PI *.3, rz:0},1000)
        //.to({x:-1000},1000)
        .onUpdate(function(){
            posParent.position.set(this.x,this.y,this.z);
            rotParent.rotation.set(this.rx,this.ry,this.rz);
        }).start();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    //hideAddressBar();

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

function goto(epos, erot) {
    var ipos = posParent.position;
    var irot = rotParent.rotation;
    new TWEEN.Tween({x:ipos.x,y:ipos.y,z:ipos.z,rx:irot.x, ry:irot.y, rz: irot.z})
        .to({x:epos.x,y:epos.y,z:epos.z,rx:erot.x, ry:erot.y, rz: erot.z},1000)
        .onUpdate(function(){
            posParent.position.set(this.x,this.y,this.z);
            rotParent.rotation.set(this.rx,this.ry,this.rz);
        }).start();
}

function updateObject(obj, epos, erot) {
    var ipos = obj.position;
    var irot = obj.rotation;
    new TWEEN.Tween({x:ipos.x,y:ipos.y,z:ipos.z,rx:irot.x, ry:irot.y, rz: irot.z})
        .to({x:epos.x,y:epos.y,z:epos.z,rx:erot.x, ry:erot.y, rz: erot.z},1000)
        .onUpdate(function(){
            obj.position.set(this.x,this.y,this.z);
            obj.rotation.set(this.rx,this.ry,this.rz);
        }).start();
}


function hideAddressBar() {
    if(document.documentElement.scrollHeight<window.outerHeight/window.devicePixelRatio)
        document.documentElement.style.height=(window.outerHeight/window.devicePixelRatio)+50+'px';
    setTimeout(window.scrollTo(1,1),0);

    //if(navigator.userAgent.match(/Android/iPhone/)){
    window.scrollTo(0,1);
    //}
}


//setTimeout(goto_y2002,1000)
//setTimeout(goto_y2013,4000)
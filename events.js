function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
    obj.attachEvent( 'on'+type, obj[type+fn] );
  } else
    obj.addEventListener( type, fn, false );
}
function removeEvent( obj, type, fn ) {
  if ( obj.detachEvent ) {
    obj.detachEvent( 'on'+type, obj[type+fn] );
    obj[type+fn] = null;
  } else
    obj.removeEventListener( type, fn, false );
}

function log() {
  var logstring = '';
  for(var i=0; i<arguments.length; i++) {
    logstring += arguments[i];
  }
  document.title = logstring;
}

var TouchEvents = {
  throwEntitiesAround : {

    last_location : [0,0],

    touchSelected : null,

    touchstart : function(e) {
      for(var i=0; i<e.changedTouches.length; i++) {
        var te = e.changedTouches[i];
        var userFinger = {
          x : te.pageX,
          y : te.pageY,
          r2 : 600
        };

        // hit other entities
        var nearest = game.xyhash.near(userFinger);
        nearest.forEach(function(v){
          if(v.hit(userFinger)) {
            TouchEvents.throwEntitiesAround.touchSelected = v;
          }
        });
      }
    },

    touchmove : function(e) {
      // no iOS web bounce!
      e.preventDefault();

      var ts = TouchEvents.throwEntitiesAround.touchSelected;
      var last = TouchEvents.throwEntitiesAround.last_location;
      if(!!ts && e.changedTouches.length) {
        var te = e.changedTouches[0];
        var userFinger = {
          x : te.pageX,
          y : te.pageY
        };
		//var diff = [userFinger.x - last[0], userFinger.y - last[1]];
		var diff = [userFinger.x - ts.x, userFinger.y - ts.y];
        ts.dx = (diff[0] > 30) ? (8*Math.sqrt(Math.abs(diff[0]) - 30) * (diff[0] > 0 ? 1 : -1))-14: diff[0];
        ts.dy = (diff[1] > 30) ? (8*Math.sqrt(Math.abs(diff[1]) - 30) * (diff[1] > 0 ? 1 : -1))-14: diff[1];
		ts.dx = ts.dx/6;
		ts.dy = ts.dy/6;
      }
	  last[0] = userFinger.x;
	  last[1] = userFinger.y;
    },

    touchend : function(e) { TouchEvents.throwEntitiesAround.touchSelected = null; }
  },

  throwWrenchesAround : {

    touchlength    : null,
    lastTouchPoint : null,
    touchDX        : [],
    touchDY        : [],

    touchstart : function(e) {
      var te = e.changedTouches;
      if(te.length>0) {
        te = te[0];
        var namespace = TouchEvents.throwWrenchesAround;

        namespace.lastTouchPoint = {
          x : te.pageX,
          y : te.pageY
        };  

        namespace.touchlength = 0;
        namespace.touchDX = [];
        namespace.touchDY = [];
      }
    },

    touchmove : function(e) {
      // no iOS web bounce!
      e.preventDefault();

      var namespace = TouchEvents.throwWrenchesAround;
      var tl        = namespace.touchlength;

      if(tl!=null && tl<3 && e.changedTouches.length) {
        var tp = namespace.lastTouchPoint;
        var te = e.changedTouches[0];
        var userFinger = {
          x : te.pageX,
          y : te.pageY
        };

        var dx = cap(userFinger.x - tp.x, 30);
        var dy = cap(userFinger.y - tp.y, 30);

        namespace.touchDX.push(dx);
        namespace.touchDY.push(dy);

        // Only throw the wrench after averaging
        if(tl==2) {

          game.entities.push(new Wrench({
            x : game.player.x,
            y : game.player.y,
            dx : dx,
            dy : dy
          }));
        }
        
        // todo : shift the touchDX, touchDY arrays
        game.player.dx = 0.5*(game.player.dx-dx*0.6);
        game.player.dy = 0.5*(game.player.dy-dy*0.6);

        namespace.touchlength++;
      }
    },

    touchend : function(e) { TouchEvents.throwWrenchesAround.touchlength = null; }
  }

};
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
            return;
          }
        });
      }
    },

    touchmove : function(e) {
      // no iOS web bounce!
      e.preventDefault();

      var ts = TouchEvents.throwEntitiesAround.touchSelected;

      if(!!ts && e.changedTouches.length) {
        var te = e.changedTouches[0];
        var userFinger = {
          x : te.pageX,
          y : te.pageY
        };

        ts.dx = cap(userFinger.x - ts.x, 30);
        ts.dy = cap(userFinger.y - ts.y, 30);
      }
    },

    touchend : function(e) { TouchEvents.throwEntitiesAround.touchSelected = null; }
  },

  throwWrenchesAround : {

  }

};
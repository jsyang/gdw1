var $ = {
  r : function(min,max) { return min + Math.random()*(max-min); }
};

var GDW1 = Class.extend({
  
  preloads : {},

  entities : [],

  xyhash : null,

  classes : {},

  touchSelected : null,

  init : function() {

    this.canvasEl         = document.getElementsByTagName('canvas')[0];
    this.canvasEl.width   = document.width;
    this.canvasEl.height  = document.height;
    this.w                = document.width;
    this.h                = document.height;

    this.ctx        = this.canvasEl.getContext('2d');
    this.ctx.w      = this.canvasEl.width;
    this.ctx.h      = this.canvasEl.height;
    this.ctx.clear  = function(){ this.clearRect(0,0,this.w,this.h);};

    this.initEntities();
    this.initTouchEvents();
    this.initXYHash();

    var self = this;
    setInterval(function(){ self.loop(); }, 30);
  },

  initXYHash : function() {
    this.xyhash = new XYHash({ 
      w : this.w, 
      h : this.h
    });
  },

  initEntities : function() {
    var startingEntities = [
      //new Player({ x : 20, y : 20, dx : 13.2, dy : 32.3 }),
      //new Enemy1({ x : 120, y : 80, dx : -13.2, dy : 12.3 }),
      new Enemy1({ x : $.r(0,this.w), y : $.r(0,this.h), dx : $.r(-20,20), dy : $.r(-20,20) }),
      new Enemy1({ x : $.r(0,this.w), y : $.r(0,this.h), dx : $.r(-20,20), dy : $.r(-20,20) }),
      new Enemy1({ x : $.r(0,this.w), y : $.r(0,this.h), dx : $.r(-20,20), dy : $.r(-20,20) }),
      new Enemy1({ x : $.r(0,this.w), y : $.r(0,this.h), dx : $.r(-20,20), dy : $.r(-20,20) }),
      new Enemy1({ x : $.r(0,this.w), y : $.r(0,this.h), dx : $.r(-20,20), dy : $.r(-20,20) })
    ];

    var self = this;
    startingEntities.forEach(function(v){
      self.entities.push(v);
    });
  },

  initTouchEvents : function() {
    var self = this;
    addEvent(this.canvasEl, 'touchstart', function(e) { self.onTouchStart(e); });
    addEvent(this.canvasEl, 'touchmove',  function(e) { self.onTouchMove(e); });
    addEvent(this.canvasEl, 'touchend',   function(e) { self.onTouchEnd(e); });
    addEvent(this.canvasEl, 'touchleave', function(e) { self.onTouchEnd(e); });
    addEvent(this.canvasEl, 'touchcancel',function(e) { self.onTouchEnd(e); });
  },

  onTouchStart : function(e) {
    for(var i=0; i<e.changedTouches.length; i++) {
      var te = e.changedTouches[i];
      var userFinger = {
        x : te.pageX,
        y : te.pageY,
        r2 : 288
      };

      // hit other entities
      var nearest = this.xyhash.near(userFinger);
      var self    = this;
      nearest.forEach(function(v){
        if(v.hit(userFinger)) {
          self.touchSelected = v;
          return;
        }
      });
    }
  },

  onTouchMove : function(e) {
    // no bounce!
    e.preventDefault();

    if(!!this.touchSelected && e.changedTouches.length) {
      var te = e.changedTouches[0];
      var userFinger = {
        x : te.pageX,
        y : te.pageY
      };

      this.touchSelected.dx = cap(userFinger.x - this.touchSelected.x,18);
      this.touchSelected.dy = cap(userFinger.y - this.touchSelected.y,18);
    }
  },

  onTouchEnd : function(e) {
    log('touchend!');
    this.touchSelected = null;
  },

  loop : function() {
    this.ctx.clear();
    this.gameCycle();
  },

  gameCycle : function() {
    var self = this;
    var newEntities = [];
    
    for(var i=0; i<this.entities.length; i++) {
      var e = this.entities[i];
      
      // hit other entities
      var nearest = this.xyhash.near(e);
      nearest.forEach(function(v){
        // Make sure we've hit the thing already
        if(v!==e && e.hit(v)) {
          var collideX = e.x - v.x;
          var collideY = e.y - v.y;

          var dist = Math.sqrt(e.dist(v));
          var _dist = 1/dist;
          var distFactor = (e.r+v.r-dist)*_dist;

          var mtdx = collideX*distFactor;
          var mtdy = collideY*distFactor;

          // push-pull
          e.x += mtdx*0.5;
          e.y += mtdy*0.5;
          v.x -= mtdx*0.5;
          v.y -= mtdy*0.5;

          var collisionVectorNormd = norm([collideX,collideY]);
          // impact speed
          var vdiff = [e.dx-v.dx, e.dy-v.dy];
          var vn    = dot(vdiff,collisionVectorNormd);

          // sphere intersecting but moving away already
          if(vn>0) return;

          // collision impulse
          var i = 0.5 * (vn * -1.8)
          var impulse = [collisionVectorNormd[0]*i, collisionVectorNormd[1]*i];

          e.dx += impulse[0];
          e.dy += impulse[1];
          v.dx -= impulse[0];
          v.dy -= impulse[1];
        }
      });

      // process entity actions
      e.alive();
      
      // draw the damn thing
      var drawInterface = e.gfx();
      this.ctx.drawImage(
        drawInterface.img,
        drawInterface.x - (drawInterface.w>>1),
        drawInterface.y - (drawInterface.h>>1)
      );

      if(!e.remove) {
        newEntities.push(e);
      }
    }

    // Add them back into the new XYHash
    this.initXYHash();
    newEntities.forEach(function(v){
      self.xyhash.add(v);
    });
    this.entities = newEntities;
  }

});


var preloader = new html5Preloader();
(function(){
  var images = 'player,enemy1';
  images.split(',').forEach(function(v){
    preloader.addFiles(v+'*:images/'+v+'.png');
  });
})();
preloader.onfinish = function(){ 
  window.game = new GDW1(); 
};
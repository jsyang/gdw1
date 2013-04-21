var $ = {
  r : function(min,max) { return min + Math.random()*(max-min); },
  R : function(min,max) { return (min + Math.random()*(max-min))>>0; }
};

var GDW1 = Class.extend({
  
  preloads : {},

  player : null,

  entities : [],

  xyhash : null,

  classes : {},

  enemySpawnRate      : 120,
  cyclesTillNextSpawn : 120,

  gameTimer : null,

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

    this.ctx.font         = '16px verdana';
    this.ctx.textBaseline = 'top';

    this.initEntities();
    this.initTouchEvents();
    this.initXYHash();

    var self = this;
    this.gameTimer = setInterval(function(){self.loop();}, 30);
  },

  initXYHash : function() {
    this.xyhash = new XYHash({ 
      w : this.w, 
      h : this.h
    });
  },

  initEntities : function() {
    this.player = new Player({ x : this.w>>1, y : this.h>>1, dx : 0, dy : 0 });
    var startingEntities = [
      this.player,

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
    var touchEventSet = 'throwWrenchesAround';

    addEvent(this.canvasEl, 'touchstart', TouchEvents[touchEventSet].touchstart);
    addEvent(this.canvasEl, 'touchmove',  TouchEvents[touchEventSet].touchmove);
    addEvent(this.canvasEl, 'touchend',   TouchEvents[touchEventSet].touchend);
    addEvent(this.canvasEl, 'touchleave', TouchEvents[touchEventSet].touchend);
    addEvent(this.canvasEl, 'touchcancel',TouchEvents[touchEventSet].touchend);
  },

  loop : function() {
    this.ctx.clear();
    this.gameCycle();
    this.addNewEnemies();
    this.drawPlayerStats();
  },

  over : function() {
    // Handle game overs!

    clearInterval(this.gameTimer);
    document.onclick = function() {
      window.location.href = window.location.href;
    };
  },

  drawPlayerStats : function() {

    var statText = [];

    if(this.player.health>0) {
      statText.push('Health: '+ this.player.health);
      statText.push('Enemies killed: '+ this.player.enemiesKilled);
    } else {
      statText.push('Game over! Tap to start new game.');
      this.over();
    }

    var self = this;
    statText.forEach(function(v,i) {
      self.ctx.fillText(v, 0, i*18);
    });
  },

  addNewEnemies : function() {
    if(this.cyclesTillNextSpawn > 0) {
      this.cyclesTillNextSpawn--;

    } else {
      var properties = {
        dx : 0,
        dy : 0
      };
      var edge    = $.R(1,4);
      var margin  = 12;

      switch(edge) {
        case 1 :  // North
          properties.y = margin;
          properties.x = $.r(margin,this.w-margin);
          break;
        case 2 :  // East
          properties.y = $.r(margin,this.h-margin);
          properties.x = margin;
          break;
        case 3 :  // South
          properties.y = this.h-margin;
          properties.x = $.r(margin,this.w-margin);
          break;
        case 4 :  // West
          properties.y = $.r(margin,this.h-margin);
          properties.x = this.w-margin;
          break;
      }
      

      this.entities.push(new Enemy1(properties));
      this.cyclesTillNextSpawn = this.enemySpawnRate>>0;
      this.enemySpawnRate-=0.1;
    }
    
  },

  gameCycle : function() {
    var self = this;
    var newEntities = [];
    
    for(var i=0; i<this.entities.length; i++) {
      var e = this.entities[i];
      
      // hit other entities
      // ~ http://stackoverflow.com/questions/345838/ball-to-ball-collision-detection-and-handling
      var nearest = this.xyhash.near(e).slice();
      for(var j=nearest.length; j-->0;) {
        var v=nearest[j];
        // Make sure we've hit the thing already
        if(v!==e && e.hit(v)) {
          // Don't try and hit anything further if we're supposed to be removed
          if(e.remove===true) break;

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

          // Bounds.
          if(e.x>self.w) {
            e.x = self.w;
          } else if(e.x<0){
            e.x = 0;
          }
          if(e.y>self.h) {
            e.y = self.h;
          } else if(e.y<0){
            e.y = 0;
          }
          if(v.x>self.w) {
            v.x = self.w;
          } else if(v.x<0){
            v.x = 0;
          }
          if(v.y>self.h) {
            v.y = self.h;
          } else if(v.y<0){
            v.y = 0;
          }

          var collisionVectorNormd = norm([collideX,collideY]);
          // impact speed
          var vdiff = [e.dx-v.dx, e.dy-v.dy];
          var vn    = dot(vdiff,collisionVectorNormd);

          // sphere intersecting but moving away already
          if(vn>0) break;

          // collision impulse
          var ci = 0.5 * (vn * -1.8)
          var impulse = [collisionVectorNormd[0]*ci, collisionVectorNormd[1]*ci];

          e.dx += impulse[0];
          e.dy += impulse[1];
          e.decaySpeed();
          
          v.dx -= impulse[0];
          v.dy -= impulse[1];
          v.decaySpeed();
        }
      }

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
      if(v.canBeHit) self.xyhash.add(v);
    });
    this.entities = newEntities;
  }

});


var preloader = new html5Preloader();
(function(){
  var images = 'player,enemy1,enemy1hurt,wrench';
  images.split(',').forEach(function(v){
    preloader.addFiles(v+'*:images/'+v+'.png');
  });
})();
preloader.onfinish = function(){ 
  window.game = new GDW1(); 
};
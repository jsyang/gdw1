var Entity = Class.extend({

  init : function(params) {
    for(var i in params) {
      this[i] = params[i];
    }
    if(this.initCb) this.initCb();
  },

  gfx : function() {
    return {
      w     : this.w,
      h     : this.h,
      img   : this.img,
      x     : this.x,
      y     : this.y
    };
  },

  aliveList : [],
  alive : function() {
    for(var i=0; i<this.aliveList.length; i++) {
      this.aliveList[i].call(this);
    }
  },

  moveAndBounce : function() {
    if(this.dx!=null && this.dy!=null) {
      var newx = this.x + this.dx;
      var newy = this.y + this.dy;
      
      if(newx<0 || newx > game.w)
        this.dx *= -1;
      else
        this.x=newx;

      if(newy<0 || newy > game.h)
        this.dy *= -1;
      else
        this.y=newy;
    }
  },

  decaySpeed : function() {
    var decayRate = 0.91;
    this.dy *= decayRate;
    this.dx *= decayRate;
  },

  hit : function(entity) {
    return this.dist(entity) < this.r2+entity.r2;
  },

  dist : function(entity) {
    var dx = Math.abs(this.x - entity.x);
    var dy = Math.abs(this.y - entity.y);
    return dx*dx+dy*dy;
  } 
});

var Player = Entity.extend({
  initCb : function() { 
    this.img = preloader.getFile('player'); 
    this.aliveList = [
      this.moveAndBounce,
      this.decaySpeed
    ];
  },
  w         : 64,
  h         : 64,
  r2        : 2048,
  r         : 32,
  canBeHit  : true
});

var Enemy1 = Entity.extend({
  initCb : function() { 
    this.img = preloader.getFile('enemy1'); 
    this.img_hurt = preloader.getFile('enemy1hurt'); 
    this.aliveList = [
      this.chasePlayer,
      this.moveAndBounce,
      this.decaySpeed,
      this.removeIfDead
    ];
  },

  gfx : function() {
    return {
      w     : this.w,
      h     : this.h,
      img   : this.beingHurt>0? this.img_hurt:this.img,
      x     : this.x,
      y     : this.y
    };
  },

  chasePlayer : function() {
    this.dx *= 0.4;
    this.dx += game.player.x>this.x? this.speed : -this.speed;
    
    this.dy *= 0.4;
    this.dy += game.player.y>this.y? this.speed : -this.speed;
  },

  removeIfDead : function() {
    if(this.health<=0) this.remove = true;
    if(this.beingHurt>0) this.beingHurt--; 
  },

  takeDamage : function(damage) {
    this.health -= damage;
    this.decaySpeed();
    this.decaySpeed();
    this.beingHurt += damage;
  },

  health    : 30,

  beingHurt : 0,

  speed     : 2,
  w         : 64,
  h         : 64,
  r         : 32,
  r2        : 2048,
  canBeHit  : true
});

var Wrench = Entity.extend({
  initCb    : function() { 
    this.img = preloader.getFile('wrench'); 
    this.aliveList = [
      this.moveAndBounce,
      this.decaySpeed,
      this.decayLifeSpan
    ];
  },

  decayLifeSpan : function() {
    if(this.lifespan>0) {
      this.lifespan--;
    } else {
      this.remove = true;
    }
  },
  
  hit : function(entity) {
    if(entity!==game.player && entity.takeDamage) {
      if(this.dist(entity)<=entity.r2+this.r2) {
        entity.takeDamage(1);
        this.remove = true;
      }
    }
  },

  lifespan      : 80,  // in cycles

  w             : 16,
  h             : 16,
  r             : 8,
  r2            : 128,
  canBeHit      : false
});
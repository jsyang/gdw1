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
      if(newx<0 || newx > game.w) {
        this.dx *= -1;
      } else
        this.x=newx;

      if(newy<0 || newy > game.h) {
        this.dy *= -1;
      } else
        this.y=newy;
    }
  },

  decaySpeed : function() {
    var decayRate = 0.91;
    this.dy *= decayRate;
    this.dx *= decayRate;
  },

  hit : function(entity) {
    var dx = Math.abs(this.x - entity.x);
    var dy = Math.abs(this.y - entity.y);
    return dx*dx+dy*dy < this.r2+entity.r2;
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
  w : 64,
  h : 64,
  r2 : 2048
});

var Enemy1 = Entity.extend({
  initCb : function() { 
    this.img = preloader.getFile('enemy1'); 
    this.aliveList = [
      this.moveAndBounce
    ];
  },
  w : 64,
  h : 64,
  r2 : 2048
});

var Wrench = Entity.extend({
  initCb : function() { this.img = preloader.getFile('wrench'); },
  w : 16,
  h : 16,
  r2 : 128
});
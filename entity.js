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

  hit : function(entity) {
    var dx = Math.abs(this.x - entity.x);
    var dy = Math.abs(this.y - entity.y);
    return dx*dx+dy*dy < this.r2+entity.r2;
  }
});

var Player = Entity.extend({
  initCb : function() { this.img = preloader.getFile('player'); },
  w : 64,
  h : 64,
  r2 : 2048,

  alive : function() {
    if(this.dx!=null && this.dy!=null) {
      this.x+=this.dx;
      this.y+=this.dy;
    }
  }

});

var Enemy1 = Entity.extend({
  initCb : function() { this.img = preloader.getFile('enemy1'); },
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
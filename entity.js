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
  }
});

var Player = Entity.extend({
  initCb : function() { this.img = preloader.getFile('player'); },
  w : 64,
  h : 64
});

var Enemy1 = Entity.extend({
  initCb : function() { this.img = preloader.getFile('enemy1'); },
  w : 64,
  h : 64
});
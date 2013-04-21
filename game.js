var GDW1 = Class.extend({
  
  preloads : {},

  entities : [],

  classes : {},

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

    var self = this;
    setInterval(function(){ self.loop(); }, 30);
  },

  initEntities : function() {
    var startingEntities = [
      new Player({ x : 20, y : 20, dx : 13.2, dy : 32.3 })
    ];

    var self = this;
    startingEntities.forEach(function(v){
      self.entities.push(v);
    });
  },

  initTouchEvents : function() {
    var self = this;
    addEvent(this.canvasEl, 'touchstart', function(e) { self.onTouchStart(e); });
  },

  onTouchStart : function(e) {
    for(var i=0; i<e.changedTouches.length; i++) {
      var te = e.changedTouches[i];
      var userFinger = {
        x : te.pageX,
        y : te.pageY,
        r2 : 288
      };

      document.title = [userFinger.x,userFinger.y,userFinger.r2];

      if(this.entities[0].hit(userFinger)) {
        alert('hit!');
      }
    }
  },

  loop : function() {
    this.ctx.clear();
    this.gameCycle();
  },

  gameCycle : function() {
    for(var i=0; i<this.entities.length; i++) {
      var e = this.entities[i];
      
      // process entity actions
      if(e.alive!=null) e.alive();
      
      // draw the damn thing
      var drawInterface = e.gfx();
      this.ctx.drawImage(
        drawInterface.img,
        drawInterface.x - (drawInterface.w>>1),
        drawInterface.y - (drawInterface.h>>1)
      );
    }
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
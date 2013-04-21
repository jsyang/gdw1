var GDW1 = Class.extend({
  
  preloads : {},

  entities : [],

  classes : {},

  init : function() {

    this.canvasEl         = document.getElementsByTagName('canvas')[0];
    this.canvasEl.width   = document.width;
    this.canvasEl.height  = document.height;

    this.ctx        = this.canvasEl.getContext('2d');
    this.ctx.w      = this.canvasEl.width;
    this.ctx.h      = this.canvasEl.height;
    this.ctx.clear  = function(){ this.clearRect(0,0,this.w,this.h);};

    this.initEntities();
    var self = this;
    setInterval(function(){ self.loop(); }, 40);
  },

  initEntities : function() {
    this.entities.push(new Player({ x : 20, y : 20 }));
  },

  loop : function() {
    this.ctx.clear();
    this.drawEntities();
  },

  drawEntities : function() {
    for(var i=0; i<this.entities.length; i++) {
      var e = this.entities[i];
      var drawInterface = e.gfx();

      this.ctx.drawImage(
        drawInterface.img,
        //0,0,
        //drawInterface.w,
        //drawInterface.h,
        drawInterface.x - (drawInterface.w>>1),
        drawInterface.y - (drawInterface.h>>1)
        //drawInterface.w,
        //drawInterface.h
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
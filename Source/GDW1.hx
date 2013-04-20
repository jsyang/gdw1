import nme.Assets;
import nme.display.Bitmap;
import nme.display.Sprite;
import nme.display.StageAlign;
import nme.display.StageDisplayState;
import nme.display.StageScaleMode;
import nme.events.Event;
import nme.events.TouchEvent;
import nme.events.MouseEvent;
import nme.Lib;

/*
class Guy {
  public var x : Float;
  public var y : Float;
  public var w : Float;
  public var w2 : Float;
  public var h : Float;
  public var h2 : Float;

  public var dx : Float;
  public var dy : Float;

  private var lastX : Float;
  private var lastY : Float;
  private var lastTouchX : Float;
  private var lastTouchY : Float;

  public var spriteImage : Bitmap;
  private static var decayRate = 0.91;

  public function new(path:String, sx:Float, sy:Float, sw:Float, sh:Float) {
    setSprite(path);
    w = sw;
    h = sh;
    w2 = sw*0.5;
    h2 = sh*0.5;
    x = sx;
    y = sy;
    dx = 4.1;
    dy = 4.1;

    lastX = x;
    lastY = y;
    lastTouchX = 0;
    lastTouchY = 0;
    //spriteImage.addEventListener(TouchEvent.TOUCH_MOVE, onTouchMove);
    //spriteImage.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
  }

  public function setSprite(path:String) : Void {
    spriteImage = new Bitmap(Assets.getBitmapData(path));
    Lib.current.stage.addChild(spriteImage);
  }

  public function updateDrawnSprite() : Void {
    x += dx;
    y += dy;
    spriteImage.x = x - w2;
    spriteImage.y = y - h2;
    decaySpeed();
  }

  private function decaySpeed() : Void {
    dx *= decayRate;
    dy *= decayRate;
  }

  public function onTouchMove(event:TouchEvent) 
  {
    
    dx = event.stageX - lastTouchX;
    dy = event.stageY - lastTouchY;

    dx = Math.abs(dx / 20.0) > 1.0? dx % 20.0 : dx;
    dy = Math.abs(dy / 20.0) > 1.0? dy % 20.0 : dy;
    
    //lastTouchX = event.stageX;
    //lastTouchY = event.stageY;
    lastX = x;
    lastY = y;
    x = event.stageX;
    y = event.stageY;
    dx = 0;
    dy = 0;
  }

  public function onTouchEnd(event:TouchEvent) 
  {
    
    //dx = event.stageX - lastTouchX;
    //dy = event.stageY - lastTouchY;
    dx = event.stageX - lastX;
    dy = event.stageY - lastY;

    dx = Math.abs(dx / 20.0) > 1.0? dx % 20.0 : dx;
    dy = Math.abs(dy / 20.0) > 1.0? dy % 20.0 : dy;
    
    //lastTouchX = event.stageX;
    //lastTouchY = event.stageY;
  }

  public function onMouseMove(event:MouseEvent) 
  {
    
    dx = event.stageX - lastTouchX;
    dy = event.stageY - lastTouchY;

    dx = Math.abs(dx / 10.0) > 1.0? dx % 10.0 : dx;
    dy = Math.abs(dy / 10.0) > 1.0? dy % 10.0 : dy;
    
    lastTouchX = event.stageX;
    lastTouchY = event.stageY;
  }

}
*/

class GDW1 {

  static var world : phx.World;

  static function main() {
    // define the size of the world
    //var size = new phx.col.AABB(-1000,-1000,1000,1000);
    var size = new phx.col.AABB(0,0,600,400);
    // create the broadphase : this is the algorithm used to optimize collision detection
    var bf = new phx.col.SortedList();
    // initialize the world
    world = new phx.World(size,bf);
    // create one 50x50 box body at x=210,y=-50
    var b1 = new phx.Body(210,50);
    b1.addShape( phx.Shape.makeBox(50,50) );
    // create one 30 radius circle at x=200,y=250
    var b2 = new phx.Body(200,250);
    b2.addShape( new phx.Circle(30,new phx.Vector(0,0.1)) );
    // create one 20x20 box body at x=100,y=270
    var b3 = new phx.Body(100,270);
    b3.addShape( phx.Shape.makeBox(20,20) );

    var b4 = new phx.Body(180,10);
    b4.addShape( phx.Shape.makeBox(10,10) );
    var b5 = new phx.Body(200,10);
    b5.addShape( phx.Shape.makeBox(10,10) );
    var b6 = new phx.Body(210,10);
    b6.addShape( phx.Shape.makeBox(10,10) );

    // add the created bodies to the world
    world.addBody(b1);
    world.addBody(b2);
    world.addBody(b3);
    world.addBody(b4);
    world.addBody(b5);
    world.addBody(b6);


    var floor     = phx.Shape.makeBox(600,10,0,390);
    var wallLeft  = phx.Shape.makeBox(10,400,0,0);
    var wallRight = phx.Shape.makeBox(10,400,590,0);
    var ceiling   = phx.Shape.makeBox(600,10,0,0);
    world.addStaticShape(floor);
    world.addStaticShape(wallLeft);
    world.addStaticShape(wallRight);
    world.addStaticShape(ceiling);


    // setup gravity
    world.gravity = new phx.Vector(0,0.2);

    // for every frame, call the loop method
    flash.Lib.current.addEventListener(flash.events.Event.ENTER_FRAME,loop);
  }

  static function loop(_) {
    // update the world
    world.step(1,20);
    // clear the graphics
    var g = flash.Lib.current.graphics;
    g.clear();
    // draw the world
    var fd = new phx.FlashDraw(g);
    fd.drawCircleRotation = false;
    fd.drawWorld(world);
  }
}

/*/ Game entry-point
class GDW1 extends Sprite {

  private var lastTouchX : Float;
  private var lastTouchY : Float;
  private var lastTouchStart : Array<Float>;

  private var guy : Guy;

  // Entry point
  public static function main() { Lib.current.addChild(new GDW1()); }
  public function new() 
  {
    super();
    initialize();
  }

  private function initialize () : Void {
    Lib.current.stage.align = StageAlign.TOP_LEFT;
    Lib.current.stage.scaleMode = StageScaleMode.SHOW_ALL;
    
    Lib.current.stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
    guy = new Guy("images/pc.png", 200.0, 120.0, 90.0, 90.0);

    Lib.current.stage.addEventListener(TouchEvent.TOUCH_MOVE, guy.onTouchMove);
    Lib.current.stage.addEventListener(TouchEvent.TOUCH_END, guy.onTouchEnd);
    Lib.current.stage.addEventListener(MouseEvent.MOUSE_MOVE, guy.onMouseMove);

    
  }

  private function onEnterFrame (event:Event) : Void {
    guy.updateDrawnSprite();
  }

}*/
import nme.Assets;
import nme.display.Bitmap;
import nme.display.Sprite;
import nme.display.StageAlign;
import nme.display.StageDisplayState;
import nme.display.StageScaleMode;
import nme.events.Event;
import nme.Lib;

// Game entry-point
class GDW1 extends Sprite {

  private var guy : Bitmap;

  // Entry point
  public static function main()
  {
    Lib.current.addChild(new GDW1());
  }

  public function new() 
  {
    super();
    initialize();
    addSprite();
  }

  private function initialize () : Void {
    
    Lib.current.stage.align = StageAlign.TOP_LEFT;
    Lib.current.stage.scaleMode = StageScaleMode.NO_SCALE;
    
    addSprite();
    addEventListener (Event.ENTER_FRAME, this_onEnterFrame);
  }

  private function drawFrame() : Void
  {

  }

  private function addSprite() : Void 
  {
    guy = new Bitmap(Assets.getBitmapData("images/pc.png"));
    addChild(guy);
  }

  private function this_onEnterFrame (event:Event) : Void {
    guy.x += 0.5;
    guy.y += 0.5;
  }

}
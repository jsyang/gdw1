import flash.external.ExternalInterface;
import nme.display.Sprite;
import nme.Lib;

enum EntityType {
	Player;
	Monster;
	Projectile;
	Inventory;
}

enum Shape {
  Circle;
}


class Vector2D {
  public var x : Float;
  public var y : Float;
  public function new(x : Float, y : Float) {
    this.x = x;
    this.y = y;
  }
  public function add(vector : Vector2D) {
    this.x += vector.x;
    this.y += vector.y;
  }
}

class Entity {
	public var position : Vector2D;
  public var delta_velocity : Vector2D;
  public var velocity : Vector2D;
	public var shape : Shape;
  
	public var radius : Float;
  public var radiussq : Float;
  public var mass : Int;
	
  public var health : Int;
	public var maxHealth : Int;
	
  public var type : EntityType;
  public var elasticity : Float;
  public var carrying : Array<Entity>;
  
  public function new(position, velocity : Vector2D, radius : Float, mass : Int, 
    health : Int, maxHealth : Int, type : EntityType, carrying : Array<Entity>) {
    this.position = position;
    this.velocity = velocity;
    this.delta_velocity = new Vector2D(0.0, 0.0);
    this.radius = radius;
    this.radiussq = radius * radius;
    this.mass = mass;
    this.health = health;
    this.maxHealth = maxHealth;
    this.type = type;
    this.carrying = carrying;
    this.elasticity = 1;
    this.shape = Circle;
  }
  
}
import Entity.Vector2D;

class World {
  var intervalms : Int;
  var entities : Array<Entity>;
  var player : Entity;
  var grid : Array<Array<Array<Entity>>>;
  
  public function new() {
    //Initialize grid array
    // [A, B), eg. A=0.2, B=0.3
    // 0, [0,1)
    // 1, [1,2)
    // 2, [2,3)
    // 3, [3,4)
    // 4, [4,5)
    // 5, [5,6)
    // 6, [6,7)
    // 7, [7,8)
    // 8, [8,9)
    // 9, [9,10]
    for (x in 0...10) {
      for (y in 0...10) {
        this.grid[x][y] = new Array<Entity>();
      }
    }    

    this.intervalms = 25;
    this.entities = new Array<Entity>();
    var position : Vector2D;
    var velocity : Vector2D;
    position = new Vector2D(0.5, 0.5);
    velocity = new Vector2D(0.0, 0.0);
    
    this.player = new Entity(position, velocity, 0.005, 1000, 1000, 1000, Player, new Array<Entity>());
    registerEntity(this.player);    
  }
  
  private function registerEntity(entity : Entity) {
    this.grid[findGridLocation(entity.position.x)][findGridLocation(entity.position.y)].push(entity);
    this.entities.push(entity);
  }
  
  private function unregisterEntity(entity : Entity) {
    this.grid[findGridLocation(entity.position.x)][findGridLocation(entity.position.y)].remove(entity); //TODO: Make sure remove actually removes the class.
    this.entities.remove(entity); //TODO: Make sure remove actually removes the class.    
  }
  
  private inline function findGridLocation(coordinate : Float) : Int {
    return cast(coordinate * 10, Int);
  }
   
  private function checkGridCollisions(entity : Entity, x, y : Int) {
    for ( other_entity in this.grid[x][y]) {
      var delta_x, delta_y : Float;
      var min_distance : Float;

      min_distance = entity.radiussq + other_entity.radiussq;
      delta_x = entity.velocity.x - other_entity.velocity.x;
      delta_x *= delta_x;
      delta_y = entity.velocity.y - other_entity.velocity.y;
      delta_y *= delta_y;
    
      //Are we colliding?
      if (min_distance > delta_x + delta_y) {
        var elasticity : Float;
        elasticity = entity.elasticity * other_entity.elasticity;
        entity.delta_velocity.x += (elasticity * other_entity.mass * (other_entity.velocity.x - entity.velocity.x) + entity.mass * entity.velocity.x + other_entity.mass * other_entity.velocity.y) / (entity.mass + other_entity.mass);
        entity.delta_velocity.y += (elasticity * other_entity.mass * (other_entity.velocity.y - entity.velocity.y) + entity.mass * entity.velocity.y + other_entity.mass * other_entity.velocity.y) / (entity.mass + other_entity.mass);
      }          
    }
  }
  
  //Go through every single object and do a single step
  public function update() {
    //Pass through all entities calculating delta. Entitiy can only affect itself.
    for (entity in this.entities) {
      var originalX, originalY : Float;
      var entityGridX, entityGridY : Int;
      entityGridX = findGridLocation(entity.position.x);
      entityGridY = findGridLocation(entity.position.y);

      //WARNING: VERY HACKISH CODE BELOW. We'll make it more elegant later.
      //Look left if we're not at the left border
      if (entityGridX != 0) {
        if (entityGridY != 0)
          checkGridCollisions(entity, entityGridX - 1, entityGridY - 1);
        checkGridCollisions(entity, entityGridX - 1, entityGridY);
        if (entityGridY != 9)
          checkGridCollisions(entity, entityGridX - 1, entityGridY + 1);
      }
      if (entityGridY != 0)
        checkGridCollisions(entity, entityGridX, entityGridY - 1);
      checkGridCollisions(entity, entityGridX, entityGridY);
      if (entityGridY != 9)
        checkGridCollisions(entity, entityGridX, entityGridY + 1);
          
          //Look right if we're not at the right border
      if (entityGridX != 9) {
        if (entityGridY != 0)
          checkGridCollisions(entity, entityGridX + 1, entityGridY - 1);
        checkGridCollisions(entity, entityGridX + 1, entityGridY);
        if (entityGridY != 9)
          checkGridCollisions(entity, entityGridX + 1, entityGridY + 1);
      }
    }
    
    //Another pass through to apply delta
    for (entity in this.entities) {
      entity.velocity.add(entity.delta_velocity);
      entity.position.add(entity.velocity);
      entity.delta_velocity.x = 0.0;
      entity.delta_velocity.y = 0.0;
    }
  }
}
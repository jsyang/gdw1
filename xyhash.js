var XYHash = Class.extend({
  
  bucketsize  : 7,
  buckets     : [],

  init : function(params) {
    for(var i in params) {
      this[i] = params[i];
    }

    this.initBuckets();
  },

  initBuckets : function() {
    var xbuckets = this.w >> this.bucketsize;
    var ybuckets = this.h >> this.bucketsize;

    for(var y=0; y<=ybuckets; y++) {
      var yb = [];
      for(var x=0; x<=xbuckets; x++) yb.push([]);
      this.buckets.push(yb)
    }
  },

  add : function(entity) {
    var yindex = entity.y >> this.bucketsize;
    var xindex = entity.x >> this.bucketsize;
    this.buckets[yindex][xindex].push(entity);
  },

  near : function(entity) {
    var yindex = entity.y >> this.bucketsize;
    var xindex = entity.x >> this.bucketsize;
    return this.buckets[yindex][xindex];
  }
});

var dot = function(v1,v2) {
  if(v1.length!=v2.length) {
    throw new Error('vector lengths not the same for dot product!');
  } else {
    var sum = 0;
    for(var l=v1.length; l-->0;) {
      sum += v1[l]*v2[l];
    }
    return sum;
  }
};

var norm = function(v) {
  var dx2 = v[0]*v[0];
  var dy2 = v[1]*v[1];
  var _length = 1/Math.sqrt(dx2+dy2);

  return [v[0]*_length,v[1]*_length];
};

var cap = function(v, limit) {
  if(Math.abs(v)>limit){
    return v>0? limit : -limit;
  }else {
    return v;
  }
};
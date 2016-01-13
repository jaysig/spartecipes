bind = function(func, context){
 var prevArgs = Array.prototype.slice.call(arguments, 2);
​
  return function(){
    var args = Array.prototype.slice.call(arguments);
    args = prevArgs.concat(args);
​
    return func.apply(context, args) 
  };
};
​
Function.prototype.bind = function(context){
  var prevArgs = Array.prototype.slice.call(arguments, 1);
  var func = this;
​
  return function(){
    var args = Array.prototype.slice.call(arguments);
    args = prevArgs.concat(args);
​
    return func.apply(context, args) 
  };
};

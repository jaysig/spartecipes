var Promise = require('bluebird');
var User = require('./userModel.js');
var Recipe = require('../recipe/recipeModel.js');

/**
 * Find a single user regardless of signup strategy used
 * @param  {object}   user     
 * @return {object}           found user profile
 */
exports.findUser = function(user) {
  var query = {};
  if (google.id) {
    query = {
      'google.id': user.goggle.id
    };
  } else {
    query = {
      'local.email': user.local.email
    };
  }
  return new Promise(function(reject, resolve) {
    User.findOne(query, function(err, profile) {
      if (err) {
        reject(err);
      } else {
        resolve(profile);
      }
    });
  });
};

/**
 * Updates users' shopping list
 * @param  {object}   data     [contains user and new list properties]
*/
exports.updateShoppingList = function(req, res, next) {

  findUser(req.body.user)
    .then(function(profile) {
      User.update({
        'local.email': profile.local.email
      }, {
        $set: {
          'profile.shoppingList': req.body.list
        }
      }, {}, function(err, affected){
        res.send(profile);
      });
    });
};

exports.removeRecipe = function(data, callback) {
  findUser(data.user, function(profile) {
    User.update({
      'local.email': profile.local.email
    }, {
      $pull: {
        'profile.shoppingList': {
          name: data.recipeName
        }
      }
    });
  });
};

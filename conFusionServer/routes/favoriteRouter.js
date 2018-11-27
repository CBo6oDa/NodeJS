var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Dish = require('../models/dishes');
var authenticate = require('../authenticate');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .all(authenticate.verifyUser)
    .get(function (req, res, next) {
        Favorites.find({'user': req.user._id})
            .populate('user')
            .populate('dishes')
            .exec(function (err, favorites) {
                if (err) return err;
                res.json(favorites);
            });
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user: req.user._id})
        .then((favorite) => {
            if (favorite) {
                for (var i=0; i<req.body.length; i++) {
                    if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                        favorite.dishes.push(req.body[i]._id);
                    }
                }
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err)); 
            }
            else {
                Favorites.create({"user": req.user._id, "dishes": req.body})
                .then((favorite) => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
            }
        }, (err) => next(err))
        .catch((err) => next(err));  
    })

    .delete(function (req, res, next) {
        Favorite.remove({'user': req.user._id}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        })
    });

favoriteRouter.route('/:dishId')
    .all(authenticate.verifyUser)
    .post(function( req,res,next){
        Favorites.find({'user': req.user._id}, function (err, favorites) {
            if (err) return err;
            var favorite = favorites ? favorites[0] : null;
            var checkPush = true;
            if (favorite) {
                for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                    if (favorite.dishes[i] == req.params.dishId) {
                        checkPush = false;
                    }
                }
                if(checkPush){
                    favorite.dishes.push(req.params.dishId);
                }
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    console.log('Pushed!');
                    res.json(favorite);
                });
            } else {
                console.log('No favourites!');
                res.json(favorite);
            }

        });
    })
    .delete(function (req, res, next) {

        Favorites.find({'user': req.user._id}, function (err, favorites) {
            if (err) return err;
            var favorite = favorites ? favorites[0] : null;

            if (favorite) {
                for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                    if (favorite.dishes[i] == req.params.dishId) {
                        favorite.dishes.remove(req.params.dishId);
                    }
                }
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    console.log('Delete!');
                    res.json(favorite);
                });
            } else {
                console.log('No favourites!');
                res.json(favorite);
            }

        });
    });

module.exports = favoriteRouter;
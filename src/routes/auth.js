const UserController = require("../controllers/UserController");
const UserModel = require('../models/Users'),
{ check, validationResult } = require('express-validator');
const posts = require("../models/posts");

module.exports = (app) =>{
    
    //Login
    app.post('/api/login',
    [
        check('email','Your email is not valid').notEmpty().isEmail(),
        check('password','Password is required').notEmpty(),
    ],
    (req,res,next)=>{
        const errors = validationResult(req); 
        if (!errors.isEmpty()) { 
            return res.status(403).json(errors) 
        }
        next();
    },
    async (req,res,next)=>{
        try {
            let option = {
                email: req.body.email,
                password: req.body.password
            }
            let user = await UserController.authenticate (option);
            return res.status(200).json({"data":user});
            
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
        
    });
    
    //get a user
     app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
    });
    
    //follow a user
    
  app.post("/api/follow/:id", async (req, res) => {
    try {
        const token =  req.headers['authorization'].split(' ')[1];
        console.log('--token--',token)
        const user = await UserModel.findOne({access_token:token});
        if(!user) {
            return res.status(404).json("User doesnt exit");
        }
        if (user._id !== req.params.id) {
            const result = await UserController.followUsers(user, req.params.id);
            return res.status(200).json(result);
          } else {
            return res.status(403).json("you cant follow yourself");
          }
    } catch (error) {
        return res.status(error.code).json({"error":error.message});
    }
   
  });
    

    //unfollow a user

    app.post("/api/unfollow/:id", async (req, res) => {
        try {
            const token =  req.headers['authorization'].split(' ')[1];
            console.log('--token--',token)
            const user = await UserModel.findOne({access_token:token});
            if(!user) {
                return res.status(404).json("User doesnt exit");
            }
            if (user._id !== req.params.id) {
                const result = await UserController.unfollowUsers(user, req.params.id);
                return res.status(200).json(result);
              } else {
                return res.status(403).json("you cant follow yourself");
              }
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
       
      });
    
    //get a user

     app.get("/api/user", async (req, res) => {
        try {
          const user = await User.findOne(req.params.user);
          
          return res.status(200).json({"UserName":user.UserName},{"Number of followings":user.followings},{"Number of followers":user.followers});
        } catch (err) {
          res.status(500).json(err);
        }
        });

}

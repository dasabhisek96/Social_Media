const PostController = require('../controllers/PostController');
const UserModel = require('../models/Users'),
{ check, validationResult } = require('express-validator');

module.exports=(app)=>{
    //create a post
    app.post("/api/posts", async(req,res)=>{
        
        try{
            const token = req.headers['authorization'].split(' ')[1];
            console.log('--token--',token)
            const user = await UserModel.findOne({access_token:token})
            if(!user) {
                return res.status(401).json("Invalid token");
            }
            let option = {
                title:req.body.title,
                desc:req.body.desc
            };
           const post = await PostController.create(user,option);
            return res.status(200).json(post);
            
        } catch(err){
            return res.status(error.code).json({"error":error.message});
        }
    });

    app.get("/api/posts/:id", async(req, res)=>{
       
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const user = await UserModel.findOne({access_token:token})
            if(!user) {
                return res.status(401).json("Invalid token");
            }
            console.log('id',req.params.id);
            const post = await PostController.retreive(req.params.id);
            return res.status(200).json(post);
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
    });


    app.delete("/api/posts/:id" , async(req,res)=>{
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const user = await UserModel.findOne({access_token:token})
            if(!user) {
                return res.status(401).json("Invalid token");
            }
            
            const result = await PostController.delete(user,req.params.id);
            return res.status(200).json(result);
            } catch (error) {
                console.log('-err--',error)
                return res.status(error.code).json({"error":error.message});
            }
    });

    app.post("/api/like/:id", async (req, res) => {
        try {
            const token =  req.headers['authorization'].split(' ')[1];
            const user = await UserModel.findOne({access_token:token});
            if(!user) {
                return res.status(404).json("Invalid token");
            }
            const result = await PostController.like(user, req.params.id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
       
      });
        
    
        //unfollow a user
    
        app.post("/api/unlike/:id", async (req, res) => {
            try {
                const token =  req.headers['authorization'].split(' ')[1];
                const user = await UserModel.findOne({access_token:token});
                if(!user) {
                    return res.status(404).json("Invalid token");
                }
                const result = await PostController.unlike(user, req.params.id);
                return res.status(200).json(result);
            } catch (error) {
                return res.status(error.code).json({"error":error.message});
            }
           
          });

        app.post("/api/comment/:id", async (req, res) => {
        try {
            const token =  req.headers['authorization'].split(' ')[1];
            const user = await UserModel.findOne({access_token:token});
            if(!user) {
                return res.status(404).json("Invalid token");
            }
            const result = await PostController.comment(user, req.params.id,req.body.comment);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
        
        });

    app.get("/api/all_posts", async(req, res)=>{
    
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const user = await UserModel.findOne({access_token:token})
            if(!user) {
                return res.status(401).json("Invalid token");
            }
            const post = await PostController.allPost(user);
            return res.status(200).json(post);
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
    });



}

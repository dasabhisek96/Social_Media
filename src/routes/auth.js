const UserController = require("../controllers/UserController");
const userController = require("../controllers/UserController"),
{ check, validationResult } = require('express-validator');

module.exports = (app) =>{
    //sign up
    app.post('/api/signup',
    [
        check('email','Your email is not valid').notEmpty().isEmail(),
        check('password','Password is required').notEmpty(),
        check('name','Name is required').notEmpty(),
        check('phone','Phone is required').notEmpty().isLength({
            min:10,
            max:10
        }).isMobilePhone()
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
                password: req.body.password,
                name: req.body.name,
                phone: req.body.phone
            };
            let user = await userController.create(option);
            return res.status(201).json({"data":user});
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }  
    });
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
            let user = await UserController.login(option);
            return res.status(200).json({"data":user});
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
        
    });
    //get a user
     app.get("/:id", async (req, res) => {
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
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
    });
    //unfollow a user

    app.post("/api/unfollow/:id", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
    });
    
     //get a user
     app.get("/api/user", async (req, res) => {
        try {
          const user = await User.findOne(req.params.user);
          
          return res.status(200).json({"UserName":UserName},{"Number of followings":followings},{"Number of followers":followers});
        } catch (err) {
          res.status(500).json(err);
        }
        });
    
    //create a post

    app.post("/api/posts", async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
   });
    //delete a post
   app.delete("/api/posts/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

    //like / dislike a post

    app.post("/api//like/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
    });
    
     //comment  a post

     app.post("/api/comments/:id", async (req, res) => {
        try {
          const post = await Post.findById(req.params.id);
          if (!post.comments.includes(req.body.userId)) {
            await post.updateOne({ $push: { comments: req.body.userId } });
            res.status(200).json("comments");
          } else {
            await post.updateOne({ $pull: { comments: req.body.userId } });
            res.status(200).json("no comments");
          }
        } catch (err) {
          res.status(500).json(err);
        }
        });

        //get a id
        app.get("/api/possts/:id", async (req, res) => {
            try {
              const post = await Post.findById(req.params.id);
              res.status(200).json(post);
            } catch (err) {
              res.status(500).json(err);
            }
          });

          //get timeline posts

        app.get("/api/all_post", async (req, res) => {
         try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
        );
        res.json(userPosts.concat(...friendPosts))
         } catch (err) {
        res.status(500).json(err);
        }
        });

}
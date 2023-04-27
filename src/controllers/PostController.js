const postModel = require('../models/posts');

class PostController {

    async create(user,option) {
        try {
            option.userId = user._id;
            return await postModel.create(option);
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async delete(user,id) {
        try {
            const post = await postModel.findById(id);
            if(!post) {
                let errorMessage = new Error("Post not available");
                    errorMessage.code = (error.code) ? error.code : 400;
                throw errorMessage;
            }
            if(user._id.toString() !== post.userId)
            {
                let errorMessage = new Error("Unauthoized");
                    errorMessage.code = 403;
                throw errorMessage;
            }
            return await postModel.deleteOne({ _id: post._id });
        } catch (error) {
            console.log('--POST--',error);
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async like(user,id) {
        try {
            console.log('--id',id);
            const post = await postModel.findById(id);
            if(!post) {
                let errorMessage = new Error("Post not available");
                    errorMessage.code = (error.code) ? error.code : 400;
                throw errorMessage;
            }
            if(!post.likes.includes(user._id)) {
               return await postModel.updateOne({_id: post._id},{ $push: { likes: user._id } });
            }
            return post;
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async unlike(user,id) {
        try {
            const post = await postModel.findById(id);
            if(!post) {
                let errorMessage = new Error("Post not available");
                    errorMessage.code = (error.code) ? error.code : 400;
                throw errorMessage;
            }
            if(!post.unlike.includes(user._id)) {
               return await postModel.updateOne({_id: post._id},{ $push: { unlike: user._id } });
            }
            return post;
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async comment(user,id,comment) {
        try {
            const post = await postModel.findById(id);
            if(!post) {
                let errorMessage = new Error("Post not available");
                    errorMessage.code = (error.code) ? error.code : 400;
                throw errorMessage;
            }
            if(!post.comment.includes(user._id)) {
               return await postModel.updateOne({_id: post._id},{ $push: { comment } });
            }
            return post;
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async retreive(id) {
        try {
            console.log('--id',id)
            return await postModel.findById(id);
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async allPost(user) {
        try {
            const post = await postModel.find({userId: user._id});
            return post;
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }
}
module.exports = new PostController();
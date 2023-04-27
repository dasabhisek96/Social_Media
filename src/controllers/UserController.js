const UserModel = require('../models/Users'),
bcrypt = require('bcrypt'),
crypto = require('crypto');

class UserController {

    constructor() {
        this.saltRound = 10;
    }

    async create(option) {
        try {
            
         
            let password = await this.hashingPassword(option.password);
            console.log('password',password)
            option.password = password;
            let user = await UserModel.create(option);
            console.log('user',user)
            if(user)
            {
                let accessToken = this.generateRandomAccessToken(user.email);
                await UserModel.updateOne({_id:user._id},{
                    $set:{
                        access_token: accessToken
                    }
                });
                return {userId: user._id,email:user.email,name:user.name,phone:user.phone,accessToken: accessToken};
            }
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }
 
    async authenticate  (option) {
        try {
            let user = await UserModel.findOne({email:option.email});
            if(!user)
            {
                let newuser = await this.create(option);
                return newuser;
            }
            let checkPassword = await bcrypt.compare(option.password,user.password);
            if(!checkPassword)
            {
                let errorMessage = new Error("Password doesn't match");
                    errorMessage.code = 403;
                throw errorMessage;
            }
            let accessToken = this.generateRandomAccessToken(user.email);
            await UserModel.updateOne({_id:user._id},{
                $set:{
                    access_token: accessToken
                }
            });
            return {accessToken: accessToken};

        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async hashingPassword(password)
    {
        try {
            let hashPassword = await bcrypt.hash(password, this.saltRound);
            return hashPassword;
        } catch (error) {
            throw error;
        }
    }

    generateRandomAccessToken(id)
    {
        let new_id = id+''+Date.now();
        return crypto.createHash("sha256").update(new_id).digest('hex');
    }

    async followUsers(user,followId) {
        try {
            const checkUser = await UserModel.findOne({_id:followId});
            if(!checkUser) {
                let errorMessage = new Error("Follow user not found");
                    errorMessage.code = (error.code) ? error.code : 400;
                throw errorMessage;
            }
            if(!user.follow.includes(checkUser._id)) {
               return await UserModel.updateOne({_id: user._id},{ $push: { follow: checkUser._id } });
            }
            return user;
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async unfollowUsers(user,followId) {
        try {
            console.log('--user---',user)
            console.log('---follow--',followId);
            const checkUser = await UserModel.findOne({_id:followId});
            console.log('---check--',checkUser)
            if(!checkUser) {
                let errorMessage = new Error("Follow user not found");
                    errorMessage.code = (error.code) ? error.code : 400;
                throw errorMessage;
            }
            if(user.follow.includes(checkUser._id)) {
               return await UserModel.updateOne({_id: user._id},{ $pull: { follow: checkUser._id } });
            }
            return user;
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }
}

module.exports = new UserController();
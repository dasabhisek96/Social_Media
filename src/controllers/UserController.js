const UserModel = require('../models/Users'),
bcrypt = require('bcrypt'),
crypto = require('crypto');

class UserController {

    constructor() {
        this.saltRound = 10;
    }

    async create(option) {
        try {
            const findUser = await UserModel.findOne({email:option.email});
            if(findUser) {
                let errorMessage = new Error("Email Already exits");
                    errorMessage.code = 403;
                throw errorMessage;
            }
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
                return {id: user._id,email:user.email,name:user.name,phone:user.phone,accessToken: accessToken};
            }
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async login (option) {
        try {
            let user = await UserModel.findOne({email:option.email});
            if(!user)
            {
                let errorMessage = new Error("Email doesn't exits");
                    errorMessage.code = 404;
                throw errorMessage;
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
}

module.exports = new UserController();
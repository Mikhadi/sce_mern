import User from '../models/user_model'
import { Request, Response } from 'express'
import bcrypt from "bcrypt";


function sendError(res: Response, error: string){
    res.status(400).send({
        'error': error
    })
}

const getUser = async(req: Request, res: Response) => {
    const id = req.params.id
    
    try{
        const user = await User.findOne({'_id': id})

        return res.status(200).send({
            "name": user.name,
            "email": user.email,
            "username": user.username,
            "avatar_url": user.avatar_url,
        })
    }catch(err){
        return sendError(res, "Failed checking user")
    }
}

const updateUser = async(req: Request, res: Response) => {
    if(req.body.password){
        try {
            const salt = await bcrypt.genSalt(10);
            const encryptedPwd = await bcrypt.hash(req.body.password, salt);
            req.body.password = encryptedPwd
        }catch(err){
            return sendError(res, "Password error")
        }
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user != null && user._id != req.body.userId) {
          return sendError(res, "User already registered");
        }
    
        user = await User.findOne({ username: req.body.username });
        if (user != null && user._id != req.body.userId) {
          return sendError(res, "User already registered");
        }
      } catch (err) {
        return sendError(res, "Failed checking user");
      }

    try{
        const filter = { _id: req.body.userId };
        const update = req.body

        await User.findOneAndUpdate(filter, update, {new: true});
        return res.status(200).send()
    }catch(err){
        return sendError(res, "Failed updating user")
    }
}

export = { getUser, updateUser }

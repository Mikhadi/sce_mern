import User from '../models/user_model'
import { Request, Response } from 'express'

function sendError(res: Response, error: string){
    res.status(400).send({
        'error': error
    })
}

const getUser = async(req: Request, res: Response) => {
    const id = req.query.id
    
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

export = { getUser }

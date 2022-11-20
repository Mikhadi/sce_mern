import User from '../models/user_model'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


function sendError(res: Response, error: string){
    res.status(400).send({
        'error': error
    })
}

const register = async(req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password

    if(email == null || password == null){
        sendError(res, 'Please provide valid email and password')
    }

    try{
        const user = await User.findOne({'email': email})
        if (user != null){
            sendError(res, 'User already registered')
        }
    }catch(err){
        sendError(res, "Failed checking user")
    }

    try{
        const salt = await bcrypt.genSalt(10)
        const encryptedPwd = await bcrypt.hash(password, salt)
        let newUser = new User({
            'email': email,
            'password': encryptedPwd
        })
        newUser = await newUser.save()
        res.status(200).send(newUser)
    }catch(err){
        sendError(res, "Failed registration")
    }
}

const login = async(req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password

    if(email == null || password == null){
        sendError(res, 'Please provide valid email and password')
    }

    try{
        const user = await User.findOne({'email': email})
        if (user == null){
            sendError(res, 'Incorrect user or password')
        }

        const match = await bcrypt.compare(password, user.password)
        if(!match) sendError(res, "Incorrect user or password")

        const accessToken = await jwt.sign(
            {'id': user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {'expiresIn': process.env.JWT_TOKEN_EXPIRATION}
        )
        return res.status(200).send({
            'accessToken': accessToken
        })
    }catch(err){
        sendError(res, "Failed checking user")
    }

}

const logout = async(req: Request, res: Response) => {
    res.status(400).send({'error':"not implemented"})
}

const authenticateMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    const authHeaders = req.headers['authorization']
    if (authHeaders == null) sendError(res, 'Authentication missing')
    const token = authHeaders && authHeaders.split(' ')[1]
    if (token == null) sendError(res, 'Authentication missing')

    try {
        const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        //TODO: fix ts
        //req.userId = user._id
        console.log("token user " + user)
        next()
    }catch(err){
        return sendError(res, 'Failed validating token')
    }
}


export = {login, register, logout, authenticateMiddleware}

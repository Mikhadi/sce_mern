import { Request } from "express"

class NewRequest {
    body: any = {}
    userId = null
    senderId = null
    postId = null

    constructor (body, userId, senderId, postId){
        this.body = body
        this.userId = userId
        this.senderId = senderId
        this.postId = postId
    }

    static fromRestRequest (req: Request){
        return new NewRequest(req.body, req.body.sender, req.query.sender, req.params.id)
    }
}

export = NewRequest
const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema(
    {
    fromUserID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        
    },
    toUserID : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status : {
        type: String,
        required: true,
        enum:{
            values: ["ignored", "interested", "accepted", "rejected"],
            messages: `{VALUE} is not supported`
        }
    }
},
{
    timestamps: true,
}
)

connectionRequestSchema.index({fromUserID: 1, toUserID: 1}) //Find the connection between two user

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserID.equals(connectionRequest.toUserID)){
        throw new Error("Cannot send connection request to yourself")
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel;
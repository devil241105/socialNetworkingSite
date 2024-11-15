// followUser 

import userModel from "../models/Auth.js";
import postModel from "../models/post.js";



const followUser = async (req, res)=> {
    try{
        const userToFollow = await userModel.findById(req.params.id);
        const loggedInUser = await userModel.findById(req.user._id);

        if(!userToFollow){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if(loggedInUser.following.includes(userToFollow._id)){
                const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
                const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id);
                loggedInUser.following.splice(indexFollowing, 1);
                userToFollow.followers.splice(indexFollowers, 1);
                await loggedInUser.save();
                await userToFollow.save();

            return res.status(400).json({
                success: true,
                message: "User Unfollowed",
            });
        }
        else{
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);
            await loggedInUser.save();
            await userToFollow.save();
            
            res.status(200).json({
                success: true,
                message: "User followed",
            });
        }

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



export { followUser };
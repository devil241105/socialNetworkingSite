// followUser deleteProfile myProfile getUserProfile getAllUser

import userModel from "../models/Auth.js";
import postModel from "../models/post.js";



const followUser = async (req, res)=> {
    try{
        const userToFollow = await userModel.findById(req.params.id);
        const loggedInUser = await userModel.findById(req.user.userId);

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

            return res.status(200).json({
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




const deleteProfile = async(req, res) =>{
    try{
        const user = await userModel.findById(req.user.userId);
        const posts = user.posts;
        const followers = user.followers;
        const following= user.following;
        const userId = user._id;
        await user.remove();
        console.log("user removed from db");

        res.clearCookie('token');
        console.log("logged out");

        //Delete all posts of the user
        for (let i=0; i<posts.length; i++){
            const post = await postModel.findById(posts[i]);
            await post.remove();
        }
        console.log("deleted all posts");

        for (let i=0; i<followers.length; i++){
            const follower = await userModel.findById(followers[i]);
            const index = follower.followers.indexOf(userId);
            follower.followers.splice(index,1);
            await follower.save();
        }
        console.log("removed user from follower's following");

        for (let i=0; i<following.length; i++){
            const follows = await userModel.findById(followers[i]);
            const index = follows.following.indexOf(userId);
            follows.following.splice(index,1);
            await follows.save();
        }
        console.log("removed user from following's list");

        res.status(200).json({
            success: true,
            message: "Profile Deleted",
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



const myProfile = async (req, res) =>{
    try{
        const user = await userModel.findById(req.user.userId).populate("posts");


        res.status(200).json({
            success: true,
            user,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


const getUserProfile = async (req,res) => {
    try{
        const user = await userModel.findById(req.params.id).populate("posts");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }
        

        res.status(200).json({
            success: true,
            user,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


const getAllUsers = async(req, res) => {
    try{
        const users = await userModel.find({});

        res.status(200).json({
            success: true,
            users,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



export { followUser, deleteProfile, myProfile, getUserProfile, getAllUsers };
//createPost deletePost likeAndUnlikePost getPostofFollowing commentOnPost deleteComment

import cloudinary from 'cloudinary';
import userModel from "../models/Auth.js";
import postModel from "../models/post.js";


// const createPost = async (req,res) => {
//     try{
//         const newPostData={
//             caption : req.body.caption,
//             image: {
//                 public_id: "req.body.public_id",
//                 url: "req.body.url",
//             },
//             owner: req.user.userId
//         };
//         console.log(req.user.userId);

//         const post = await postModel.create(newPostData);
//         console.log(post);

//         const user = await userModel.findById(req.user.userId);
//         console.log(post._id);

//         user.posts.push(post._id);

//         await user.save();
//         res.status(201).json({
//             success: true,
//             post,
//         });
//     }catch (error) {
//         console.error("Post creation error:", error.message);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };

const createPost = async (req, res) => {
    try {
      const { caption } = req.body;
      const { path, filename } = req.file;
  
      const newPostData = {
        caption,
        image: {
          public_id: filename, // Public ID from Cloudinary
          url: path,           // URL of the uploaded image
        },
        owner: req.user.userId,
      };
  
      const post = await postModel.create(newPostData);
      const user = await userModel.findById(req.user.userId);
  
      user.posts.push(post._id);
      await user.save();
  
      res.status(201).json({
        success: true,
        post,
      });
    } catch (error) {
      console.error("Error creating post:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  

const deletePost = async(req,res)=>{
    try{
        console.log("delete post route hit");
        const post = await postModel.findById(req.params.id);
        console.log(req.params.id);
        console.log(post);
        console.log(post.owner);
        if(!post){
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if(post.owner.toString() !== req.user.userId.toString()){
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await post.deleteOne();
        const user= await userModel.findById(req.user.userId);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index,1);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Post deleted"
        });
    }
    catch (error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




const likeAndUnlikePost = async(req, res)=>{
    try{
        const post = await postModel.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        
        if(post.likes.includes(req.user.userId)){
            const index = post.likes.indexOf(req.user.userId);
            post.likes.splice(index, 1);
            await post.save();
            
            return res.status(200).json({
                success: true,
                message: "Post Unliked",
            });

        }

        else{
            post.likes.push(req.user.userId);
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post Liked",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const getPostOfFollowing = async (req,res) => {
    try{

        const user= await userModel.findById(req.user.userId);
        const posts = await postModel.find({
            owner: {
                $in: user.following,
            },
        });

        res.status(200).json({
            success: true,
            posts,
            message: "found data",
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


const commentOnPost = async(req,res) => {
    try{
        const post = await postModel.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        let commentIndex = -1;
        post.Comments.forEach((item, index) => {
            console.log(item);
            if((item.user.toString) === req.user.userId.toString()){
                commentIndex = index;
            }
        });

        if(commentIndex !== -1){
            post.Comments[commentIndex].Comment = req.body.comment;
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Comment updated",
            });
        }
        else{
            post.Comments.push({
                user: req.user.userId,
                Comment: req.body.comment,

            });
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Comment added",
            });
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


const deleteComment = async(req,res) => {
    try{
        const post = await postModel.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        if(post.owner.toString()===req.user.userId.toString()){
            if (req.body.commentId==undefined){
                return res.status(404).json({
                    success: false,
                    message: "comment ID required",
                });
            }
            post.Comments.forEach((item, index) => {
                if (item._id.toString()=== req.body.commentId.toString()){
                    return post.Comments.splice(index,1);
                }
            });
            await post.save();

            res.status(200).json({
                success: true,
                message: "you deleted the comment"
            });
        }
        else{
            post.Comments.forEach((item, index) => {
                console.log(item);
                if((item.user.toString) === req.user.userId.toString()){
                    return post.Comments.splice(index,1);
                }
            });
            await post.save();

            return res.status(200).json({
                success: true,
                message: "your comment has been deleted"
            });
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



export { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, commentOnPost, deleteComment }; 
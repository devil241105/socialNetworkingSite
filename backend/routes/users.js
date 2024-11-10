import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from '../controllers/users.js';
import {jwtAuthMiddleware} from '../middlewares/jwt.js';
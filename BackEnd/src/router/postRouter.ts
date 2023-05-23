import express from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDatabase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export const posttRouter = express.Router();

const postController = new PostController(
  new PostBusiness(new PostDatabase(), new IdGenerator(), new TokenManager())
);

posttRouter.post("/", postController.createPost);
posttRouter.get("/", postController.getPost);
posttRouter.put("/:id", postController.editPost);
posttRouter.delete("/:id", postController.deletePost);

posttRouter.put("/:id/like", postController.likeOrDislikePost);

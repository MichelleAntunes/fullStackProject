import express from "express";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentController } from "../controller/CommentController";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";

export const commentRouter = express.Router();

const commentController = new CommentController(
  new CommentBusiness(
    new CommentDatabase(),
    new PostDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
);

commentRouter.post("/:postId/comments", commentController.createComment);
commentRouter.put(
  "/:postId/comments/:commentId",
  commentController.editCommentById
);
commentRouter.put(
  "/:postId/comments/:commentId/like",
  commentController.likeOrDislikeComment
);
commentRouter.delete(
  "/:postId/comments/:commentId",
  commentController.deleteCommentById
);

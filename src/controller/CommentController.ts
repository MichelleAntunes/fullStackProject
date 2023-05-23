import { Request, Response } from "express";
import { ZodError } from "zod";
import { CommentBusiness } from "../business/CommentBusiness";
import { CreateCommentSchema } from "../dtos/comment/createComment.dto";
import { GetCommentsSchema } from "../dtos/comment/getCommentsByPostIs.dto";
import { LikeOrDislikeCommentSchema } from "../dtos/comment/likeOrDislikeComment.dto";
import { BaseError } from "../errors/BaseError";

export class CommentController {
  constructor(private commentBusiness: CommentBusiness) {}

  public createComment = async (req: Request, res: Response) => {
    try {
      const input = CreateCommentSchema.parse({
        token: req.headers.authorization,
        postId: req.params.id,
        content: req.body.content,
      });

      const output = await this.commentBusiness.createComment(input);

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Unexpected Error");
      }
    }
  };

  public getCommentsByPostId = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsSchema.parse({
        token: req.headers.authorization,
        postId: req.params.id,
      });

      const output = await this.commentBusiness.getCommentsByPostId(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Unexpected Error");
      }
    }
  };

  public likeOrDislikeComment = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: req.headers.authorization,
        idToLikeOrDislike: req.params.id,
        like: req.body.like,
      });

      const output = await this.commentBusiness.likeOrDislikeComment(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Unexpected Error");
      }
    }
  };
}

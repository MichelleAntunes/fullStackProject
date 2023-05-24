import { z } from "zod";

export const LikeOrDislikeCommentSchema = z.object({
  postId: z.string().min(1),
  commentId: z.string().min(1),
  token: z.string().min(1),
  like: z.boolean(),
});

export type LikeOrDislikeCommentInputDTO = z.infer<
  typeof LikeOrDislikeCommentSchema
>;

export type LikeOrDislikeCommentOutputDTO = undefined;

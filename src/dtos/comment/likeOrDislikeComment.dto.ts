import z from "zod";

export const LikeOrDislikeCommentSchema = z.object({
  token: z.string().min(1),
  idToLikeOrDislike: z.string().min(1),
  like: z.boolean(),
});

export type LikeOrDislikeCommentInputDTO = z.infer<
  typeof LikeOrDislikeCommentSchema
>;

export interface LikeOrDislikeCommentOutputDTO {
  message: "Liked or Disliked";
}

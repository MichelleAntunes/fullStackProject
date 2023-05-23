import z from "zod";
import { PostCommentModel } from "../../models/Comment";

export const GetCommentsSchema = z.object({
  token: z.string().min(1),
  postId: z.string().min(1),
});

export type GetCommentsInputDTO = z.infer<typeof GetCommentsSchema>;

export interface GetCommentsOutputDTO {
  comments: PostCommentModel[];
}

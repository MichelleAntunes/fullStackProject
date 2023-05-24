import { z } from "zod";

export const EditCommentByIdSchema = z.object({
  postId: z.string().min(1),
  commentId: z.string().min(1),
  content: z.string().min(1),
  token: z.string().min(1),
});

export type EditCommentByIdInputDTO = z.infer<typeof EditCommentByIdSchema>;

export const EditCommentByIdSchemaOutput = z.object({
  message: z.string().min(1),
});

export type EditCommentByIdOutputDTO = z.infer<
  typeof EditCommentByIdSchemaOutput
>;

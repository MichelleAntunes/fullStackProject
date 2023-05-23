import { CommentDatabase } from "../database/CommentDatabase";

import { PostDatabase } from "../database/PostDatabase";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/comment/createComment.dto";
import {
  GetCommentsInputDTO,
  GetCommentsOutputDTO,
} from "../dtos/comment/getCommentsByPostIs.dto";
import {
  LikeOrDislikeCommentInputDTO,
  LikeOrDislikeCommentOutputDTO,
} from "../dtos/comment/likeOrDislikeComment.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  Comment,
  COMMENT_LIKE,
  LikeDislikeCommentDB,
  PostCommentDB,
} from "../models/Comment";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    const { token, postId, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    const postIdExists = await this.postDatabase.findPostWithCreatorNameById(
      postId
    );

    if (!postIdExists) {
      throw new NotFoundError("Invalid post id");
    }

    const id = this.idGenerator.generate();

    const newComment = new Comment(
      id,
      content,
      0,
      0,
      new Date().toISOString(),
      payload.id,
      payload.name
    );

    const newCommentDB = newComment.toDBModel();

    await this.commentDatabase.insertComment(newCommentDB);

    const newPostCommentDB: PostCommentDB = {
      post_id: postId,
      comment_id: id,
    };

    await this.commentDatabase.insertPostComment(newPostCommentDB);

    const updatePostIdExists = new Post(
      postIdExists.id,
      postIdExists.body,
      postIdExists.likes,
      postIdExists.dislikes,
      postIdExists.comment,
      postIdExists.created_at,
      postIdExists.updated_at,
      postIdExists.creator_id,
      postIdExists.creator_name
    );

    updatePostIdExists.addComment();

    const updatePostIdExistsDB = updatePostIdExists.toDBModel();
    await this.postDatabase.updatePost(updatePostIdExistsDB);

    const output: CreateCommentOutputDTO = {
      message: "Comment created",
    };

    return output;
  };

  public getCommentsByPostId = async (
    input: GetCommentsInputDTO
  ): Promise<GetCommentsOutputDTO> => {
    const { token, postId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    const postIdExists = await this.postDatabase.findPostWithCreatorNameById(
      postId
    );

    if (!postIdExists) {
      throw new NotFoundError("Invalid post id");
    }

    const postComments = await this.commentDatabase.findCommentsByPostId(
      postId
    );

    const output: GetCommentsOutputDTO = {
      comments: postComments,
    };

    return output;
  };

  public likeOrDislikeComment = async (
    input: LikeOrDislikeCommentInputDTO
  ): Promise<LikeOrDislikeCommentOutputDTO> => {
    const { token, idToLikeOrDislike, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    const commentIdExists =
      await this.commentDatabase.findCommentsWithCreatorNameById(
        idToLikeOrDislike
      );

    if (!commentIdExists) {
      throw new NotFoundError("Comment not found");
    }

    const comment = new Comment(
      commentIdExists.id,
      commentIdExists.comment_content,
      commentIdExists.likes,
      commentIdExists.dislikes,
      commentIdExists.created_at,
      commentIdExists.creator_id,
      commentIdExists.creator_name
    );

    if (payload.id === comment.getCreatorId()) {
      throw new ForbiddenError(
        "The comment creator can not give likes or dislikes"
      );
    }
    const likeSQLite = like ? 1 : 0;

    const likeOrDislikeDB: LikeDislikeCommentDB = {
      user_id: payload.id,
      comment_id: commentIdExists.id,
      like: likeSQLite,
    };

    const likeOrDislikeCommentExists =
      await this.commentDatabase.findLikeOrDislikeComment(likeOrDislikeDB);

    if (likeOrDislikeCommentExists === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeOrDislike(likeOrDislikeDB);
        comment.removeLike();
      } else {
        await this.commentDatabase.updateLikeOrDislike(likeOrDislikeDB);
        comment.removeLike();
        comment.addDislike();
      }
    } else if (likeOrDislikeCommentExists === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.commentDatabase.removeLikeOrDislike(likeOrDislikeDB);
        comment.removeDislike();
      } else {
        await this.commentDatabase.updateLikeOrDislike(likeOrDislikeDB);
        comment.removeDislike();
        comment.addLike();
      }
    } else {
      await this.commentDatabase.insertLikeOrDislike(likeOrDislikeDB);
      like ? comment.addLike() : comment.addDislike();
    }

    const updatedCommentDB = comment.toDBModel();
    await this.commentDatabase.editComment(updatedCommentDB);

    const output: LikeOrDislikeCommentOutputDTO = {
      message: "Liked or Disliked",
    };

    return output;
  };
}

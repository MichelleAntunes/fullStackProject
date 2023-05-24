import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/comment/createComment.dto";
import {
  DeleteCommentByIdInputDTO,
  DeleteCommentByIdOutputDTO,
} from "../dtos/comment/deleteCommentById.dto";
import {
  EditCommentByIdInputDTO,
  EditCommentByIdOutputDTO,
} from "../dtos/comment/editComment.dto";
import {
  LikeOrDislikeCommentInputDTO,
  LikeOrDislikeCommentOutputDTO,
} from "../dtos/comment/likeOrDislikeComment.dto";
import {
  COMMENT_LIKE,
  Comment,
  CommentDB,
  CommentWithCreatorDB,
  LikeDislikeCommentDB,
} from "../models/Comment";
import { Post, PostDB, PostDBWithCreatorName } from "../models/Post";
import { TokenPayload, USER_ROLES } from "../models/User";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

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
    const { postId, content, token } = input;

    const payload: TokenPayload | null = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB: PostDB | undefined = await this.postDatabase.findPostById(
      postId
    );

    if (!postDB) {
      throw new NotFoundError(
        "Post não encontrado. Verifique o id e tente novamente."
      );
    }

    const post = new Post(
      postDB.id,
      postDB.body,
      postDB.comments,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at,
      postDB.creator_id,
      payload.name
    );

    const id: string = this.idGenerator.generate();

    const newComment = new Comment(
      id,
      postId,
      content,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.id,
      payload.name
    );

    const newCommentDB: CommentDB = newComment.toDBModel();
    await this.commentDatabase.insertComment(newCommentDB);

    post.addComment();
    const updatedPostDB: PostDB = post.toDBModel();
    await this.postDatabase.updatePost(updatedPostDB);

    const output: CreateCommentOutputDTO = {
      message: "Comentário criado com sucesso!",
    };

    return output as CreateCommentOutputDTO;
  };

  public editCommentById = async (
    input: EditCommentByIdInputDTO
  ): Promise<EditCommentByIdOutputDTO> => {
    const { postId, commentId, content, token } = input;

    const payload: TokenPayload | null = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB: PostDB | undefined = await this.postDatabase.findPostById(
      postId
    );

    if (!postDB) {
      throw new NotFoundError(
        "Post não encontrado. Verifique o id e tente novamente."
      );
    }

    const commentDB: CommentDB | undefined =
      await this.commentDatabase.getCommentById(commentId);

    if (!commentDB) {
      throw new NotFoundError(
        "Comentário não encontrado. Verifique o id e tente novamente."
      );
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== commentDB.creator_id) {
        throw new ForbiddenError(
          "Somente o criador do comentário ou um ADMIN podem editá-lo. Caso não tenha acesso a sua conta, entre em contato com nosso suporte."
        );
      }
    }

    const comment = new Comment(
      commentDB.id,
      commentDB.post_id,
      commentDB.content,
      commentDB.likes,
      commentDB.dislikes,
      commentDB.created_at,
      commentDB.updated_at,
      commentDB.creator_id,
      payload.name
    );

    comment.CONTENT = content;
    comment.UPDATED_AT = new Date().toISOString();

    const updatedCommentDB: CommentDB = comment.toDBModel();
    await this.commentDatabase.updateCommentById(updatedCommentDB);

    const output: EditCommentByIdOutputDTO = {
      message: "Comentário atualizado com sucesso!",
    };

    return output;
  };

  public deleteCommentById = async (
    input: DeleteCommentByIdInputDTO
  ): Promise<DeleteCommentByIdOutputDTO> => {
    const { postId, commentId, token } = input;

    const payload: TokenPayload | null = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDB: CommentDB | undefined =
      await this.commentDatabase.getCommentById(commentId);

    if (!commentDB) {
      throw new NotFoundError(
        "Comentário não encontrado. Verifique o id e tente novamente."
      );
    }

    const postWithCreatorDB: PostDBWithCreatorName | undefined =
      await this.postDatabase.findPostWithCreatorNameById(postId);

    if (!postWithCreatorDB) {
      throw new NotFoundError(
        "Post não encontrado. Verifique se o post ainda existe e tente novamente."
      );
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== postWithCreatorDB.creator_id) {
        if (payload.id !== commentDB.creator_id) {
          throw new ForbiddenError(
            "Somente o autor do comentário, o autor do post ou um ADMIN podem excluir o comentário. Caso não tenha acesso a sua conta, entre em contato com nosso suporte."
          );
        }
      }
    }

    await this.commentDatabase.deleteCommentById(commentId);

    const post = new Post(
      postWithCreatorDB.id,
      postWithCreatorDB.body,
      postWithCreatorDB.comments,
      postWithCreatorDB.likes,
      postWithCreatorDB.dislikes,
      postWithCreatorDB.created_at,
      postWithCreatorDB.updated_at,
      postWithCreatorDB.creator_id,
      postWithCreatorDB.creator_name
    );

    post.removeComment();
    const updatedPostDB: PostDB = post.toDBModel();
    await this.postDatabase.updatePost(updatedPostDB);

    const output: DeleteCommentByIdOutputDTO = {
      message: "Comentário excluído com sucesso!",
    };

    return output as DeleteCommentByIdOutputDTO;
  };

  public likeOrDislikeComment = async (
    input: LikeOrDislikeCommentInputDTO
  ): Promise<LikeOrDislikeCommentOutputDTO> => {
    const { postId, commentId, token, like } = input;

    const payload: TokenPayload | null = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentWithCreatorDB: CommentWithCreatorDB | undefined =
      await this.commentDatabase.getCommentWithCreatorById(commentId);

    if (!commentWithCreatorDB) {
      throw new NotFoundError(
        "Comentário não encontrado. Verifique o id e tente novamente."
      );
    }

    const postDB: PostDB | undefined = await this.postDatabase.findPostById(
      postId
    );

    if (!postDB) {
      throw new NotFoundError(
        "Post não encontrado. Verifique se o post ainda existe e tente novamente."
      );
    }

    if (payload.id === commentWithCreatorDB.creator_id) {
      throw new ForbiddenError(
        "Não é possível interagir com seu próprio comentário."
      );
    }

    const comment = new Comment(
      commentWithCreatorDB.id,
      commentWithCreatorDB.post_id,
      commentWithCreatorDB.content,
      commentWithCreatorDB.likes,
      commentWithCreatorDB.dislikes,
      commentWithCreatorDB.created_at,
      commentWithCreatorDB.updated_at,
      commentWithCreatorDB.creator_id,
      commentWithCreatorDB.creator_username
    );

    const likeSQLite: number = like ? 1 : 0;

    const likeDislikeCommentDB: LikeDislikeCommentDB = {
      user_id: payload.id,
      post_id: postId,
      comment_id: commentId,
      like: likeSQLite,
    };

    const likeDislikeExists: COMMENT_LIKE | undefined =
      await this.commentDatabase.getLikeDislikeFromCommentById(
        likeDislikeCommentDB
      );

    likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED && like
      ? (await this.commentDatabase.removeLikeDislikeFromCommentById(
          likeDislikeCommentDB
        ),
        comment.removeLike())
      : likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED && !like
      ? (await this.commentDatabase.updateLikeDislikeFromCommentById(
          likeDislikeCommentDB
        ),
        comment.removeLike(),
        comment.addDislike())
      : likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED && !like
      ? (await this.commentDatabase.removeLikeDislikeFromCommentById(
          likeDislikeCommentDB
        ),
        comment.removeDislike())
      : likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED && like
      ? (await this.commentDatabase.updateLikeDislikeFromCommentById(
          likeDislikeCommentDB
        ),
        comment.removeDislike(),
        comment.addLike())
      : likeDislikeExists === undefined && like
      ? (await this.commentDatabase.insertLikeDislikeInCommentById(
          likeDislikeCommentDB
        ),
        comment.addLike())
      : (await this.commentDatabase.insertLikeDislikeInCommentById(
          likeDislikeCommentDB
        ),
        comment.addDislike());

    const updatedCommentDB: CommentDB = comment.toDBModel();

    await this.commentDatabase.updateCommentById(updatedCommentDB);

    const output: LikeOrDislikeCommentOutputDTO = undefined;
    return output as LikeOrDislikeCommentOutputDTO;
  };
}

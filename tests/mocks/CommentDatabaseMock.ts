import { BaseDatabase } from "../../src/database/BaseDatabase";
import {
  COMMENT_LIKE,
  CommentDB,
  CommentWithCreatorDB,
  LikeDislikeCommentDB,
} from "../../src/models/Comment";
import { UserDB } from "../../src/models/User";
import { usersMock } from "./UserDatabaseMock";

export const commentsMock: CommentDB[] = [
  {
    id: "c001",
    creator_id: "id-mock-admin",
    content: "Exemplo de Comentário 1",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    post_id: "p001",
  },
  {
    id: "c002",
    creator_id: "id-mock-normal",
    content: "Exemplo de Comentário 2",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    post_id: "p001",
  },
  {
    id: "c003",
    creator_id: "id-mock-normal",
    content: "Exemplo de Comentário 3",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    post_id: "p002",
  },
  {
    id: "c004",
    creator_id: "id-mock",
    content: "Exemplo de Comentário 4",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    post_id: "p002",
  },
];

const likesOrDislikesCommentMock: LikeDislikeCommentDB[] = [
  {
    user_id: "id-mock-normal",
    post_id: "p001",
    comment_id: "c001",
    like: 1,
  },
  {
    user_id: "id-mock",
    post_id: "p001",
    comment_id: "c001",
    like: 0,
  },
  {
    user_id: "id-mock",
    post_id: "p001",
    comment_id: "c002",
    like: 0,
  },
  {
    user_id: "id-mock-admin",
    post_id: "p002",
    comment_id: "c003",
    like: 1,
  },
  {
    user_id: "id-mock-admin",
    post_id: "p002",
    comment_id: "c004",
    like: 1,
  },
];

export class CommentDatabaseMock extends BaseDatabase {
  public async getCommentById(id: string): Promise<CommentDB | undefined> {
    return commentsMock.filter((comment) => comment.id === id)[0];
  }

  public async getCommentWithCreatorById(
    id: string
  ): Promise<CommentWithCreatorDB | undefined> {
    switch (id) {
      case "c001":
        return {
          id: "c001",
          creator_id: "id-mock-admin",
          creator_username: "user_normal",
          content: "Exemplo de Comentário 1",
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          post_id: "p001",
        };
      case "c002":
        return {
          id: "c002",
          creator_id: "id-mock-normal",
          creator_username: "user_normal",
          content: "Exemplo de Comentário 2",
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          post_id: "p001",
        };

      case "c003":
        return {
          id: "c003",
          creator_id: "id-mock-normal",
          creator_username: "user_admin",
          content: "Exemplo de Comentário 3",
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          post_id: "p002",
        };

      case "c004":
        return {
          id: "c004",
          creator_id: "id-mock",
          creator_username: "user_admin",
          content: "Exemplo de Comentário 4",
          likes: 0,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          post_id: "p002",
        };

      default:
        return undefined;
    }
  }

  public async getCommentsWithCreatorByPostId(
    id: string
  ): Promise<CommentWithCreatorDB[]> {
    switch (id) {
      case "p001":
        return [
          {
            id: "c001",
            creator_id: "id-mock-admin",
            creator_username: "user_normal",
            content: "Exemplo de Comentário 1",
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            post_id: "p001",
          },
          {
            id: "c002",
            creator_id: "id-mock-normal",
            creator_username: "user_normal",
            content: "Exemplo de Comentário 2",
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            post_id: "p001",
          },
        ];

      case "p002":
        return [
          {
            id: "c003",
            creator_id: "id-mock-normal",
            creator_username: "user_admin",
            content: "Exemplo de Comentário 3",
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            post_id: "p002",
          },
          {
            id: "c004",
            creator_id: "id-mock",
            creator_username: "user_admin",
            content: "Exemplo de Comentário 4",
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            post_id: "p002",
          },
        ];

      default:
        return [];
    }
  }

  public async insertComment(newCommentDB: CommentDB): Promise<void> {}

  public async updateCommentById(commentDB: CommentDB): Promise<void> {}

  public async deleteCommentById(id: string): Promise<void> {}

  public async getLikeDislikeFromCommentById(
    likeDislikeCommentDB: LikeDislikeCommentDB
  ): Promise<COMMENT_LIKE | undefined> {
    const result: LikeDislikeCommentDB = likesOrDislikesCommentMock.filter(
      (likeOrDislikeCommentMock) => {
        likeDislikeCommentDB.user_id === likeOrDislikeCommentMock.user_id &&
          likeDislikeCommentDB.comment_id ===
            likeOrDislikeCommentMock.comment_id;
      }
    )[0];

    return result === undefined
      ? undefined
      : result && result.like === 1
      ? COMMENT_LIKE.ALREADY_LIKED
      : COMMENT_LIKE.ALREADY_DISLIKED;
  }

  public async getLikeDislikeFromCommentByUserId(
    id: string
  ): Promise<LikeDislikeCommentDB[]> {
    switch (id) {
      case "id-mock-normal":
        return [
          {
            user_id: "id-mock-normal",
            post_id: "p001",
            comment_id: "c001",
            like: 1,
          },
        ];

      case "id-mock-admin":
        return [
          {
            user_id: "id-mock-admin",
            post_id: "p001",
            comment_id: "c001",
            like: 1,
          },
          {
            user_id: "id-mock-admin",
            post_id: "p002",
            comment_id: "c003",
            like: 1,
          },
          {
            user_id: "id-mock-admin",
            post_id: "p003",
            comment_id: "c004",
            like: 1,
          },
        ];

      case "id-mock":
        return [
          {
            user_id: "id-mock",
            post_id: "p001",
            comment_id: "c001",
            like: 0,
          },
        ];

      default:
        return [];
    }
  }

  public insertLikeDislikeInCommentById = async (
    likeDislikeCommentDB: LikeDislikeCommentDB
  ): Promise<void> => {};

  public updateLikeDislikeFromCommentById = async (
    likeDislikeCommentDB: LikeDislikeCommentDB
  ): Promise<void> => {};

  public removeLikeDislikeFromCommentById = async (
    likeDislikeCommentDB: LikeDislikeCommentDB
  ): Promise<void> => {};
}

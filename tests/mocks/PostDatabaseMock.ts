import {
  LikeDislikePostDB,
  POST_LIKE,
  PostDB,
  PostWithCommentsDB,
  PostDBWithCreatorName,
} from "../../src/models/Post";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { usersMock } from "./UserDatabaseMock";
import { UserDB } from "../../src/models/User";
import { CommentDB, CommentWithCreatorDB } from "../../src/models/Comment";
import { commentsMock } from "./CommentDatabaseMock";
import { PostDatabase } from "../../src/database/PostDatabase";

const postsMock: PostDB[] = [
  {
    id: "p001",
    creator_id: "id-mock-normal",
    body: "Exemplo de conteúdo de post 1",
    comments: 0,
    likes: 1,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p002",
    creator_id: "id-mock-admin",
    body: "Exemplo de conteúdo de post 2",
    comments: 0,
    likes: 1,
    dislikes: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const likesOrDislikesPostMock: LikeDislikePostDB[] = [
  {
    user_id: "id-mock-admin",
    post_id: "p001",
    like: 1,
  },
  {
    user_id: "id-mock-normal",
    post_id: "p002",
    like: 0,
  },
  {
    user_id: "id-mock",
    post_id: "p002",
    like: 1,
  },
];

export class PostDatabaseMock extends PostDatabase {
  public async getPostsWithCreator(
    query: string | undefined
  ): Promise<PostDBWithCreatorName[]> {
    if (query) {
      const postsMockWithCreator: PostDBWithCreatorName[] = postsMock.map(
        (postMock) => {
          const user: UserDB = usersMock.filter(
            (user) => user.id === postMock.creator_id
          )[0];

          const post: PostDBWithCreatorName = {
            ...postMock,
            creator_name: user.name,
          };

          return post;
        }
      );

      return postsMockWithCreator.filter((post) =>
        post.body.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      );
    } else {
      return postsMock.map((postMock) => {
        const user: UserDB = usersMock.filter(
          (user) => user.id === postMock.creator_id
        )[0];

        const post: PostDBWithCreatorName = {
          ...postMock,
          creator_name: user.name,
        };

        return post;
      });
    }
  }

  public async getPostById(id: string): Promise<PostDB | undefined> {
    return postsMock.filter((post) => post.id === id)[0];
  }

  public async getPostWithCreatorById(
    id: string
  ): Promise<PostDBWithCreatorName | undefined> {
    switch (id) {
      case "p001":
        return {
          id: "p001",
          body: "Exemplo de conteúdo de post 1",
          comments: 0,
          likes: 1,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator_id: "id-mock-normal",
          creator_name: "user_normal",
        };
      case "p002":
        return {
          id: "p002",
          body: "Exemplo de conteúdo de post 2",
          comments: 0,
          likes: 1,
          dislikes: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator_id: "id-mock-admin",
          creator_name: "user_admin",
        };

      default:
        return undefined;
    }
  }

  public async getPostWithCreatorAndCommentsById(
    id: string
  ): Promise<PostWithCommentsDB | undefined> {
    switch (id) {
      case "p001":
        return {
          id: "p001",
          content: "Exemplo de conteúdo de post 1",
          comments: 0,
          likes: 1,
          dislikes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator_id: "id-mock-normal",
          creator_username: "user_normal",
          comments_post: [
            {
              id: "c001",
              content: "Exemplo de Comentário 1",
              likes: 0,
              dislikes: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              post_id: "p001",
              creator_id: "id-mock-admin",
              creator_username: "user_admin",
            },
            {
              id: "c002",
              content: "Exemplo de Comentário 2",
              likes: 0,
              dislikes: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              post_id: "p001",
              creator_id: "id-mock-normal",
              creator_username: "user_normal",
            },
          ],
        };
      case "p002":
        return {
          id: "p002",
          content: "Exemplo de conteúdo de post 2",
          comments: 0,
          likes: 1,
          dislikes: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator_id: "id-mock-admin",
          creator_username: "user_admin",
          comments_post: [
            {
              id: "c003",
              content: "Exemplo de Comentário 3",
              likes: 0,
              dislikes: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              post_id: "p002",
              creator_id: "id-mock-normal",
              creator_username: "user_normal",
            },
            {
              id: "c004",
              content: "Exemplo de Comentário 4",
              likes: 0,
              dislikes: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              post_id: "p002",
              creator_id: "id-mock",
              creator_username: "user_test",
            },
          ],
        };

      default:
        return undefined;
    }
  }

  // public async insertPost(postDB: PostDB): Promise<void> {}

  // public async updatePostById(postDB: PostDB): Promise<void> {}

  // public async deletePostById(idToDelete: string): Promise<void> {}

  public async getLikeDislikeFromPostById(
    likeDislikePostDB: LikeDislikePostDB
  ): Promise<POST_LIKE | undefined> {
    const result: LikeDislikePostDB = likesOrDislikesPostMock.filter(
      (likeOrDislikePostMock) => {
        likeDislikePostDB.user_id === likeOrDislikePostMock.user_id &&
          likeDislikePostDB.post_id === likeOrDislikePostMock.post_id;
      }
    )[0];

    return result === undefined
      ? undefined
      : result && result.like === 1
      ? POST_LIKE.ALREADY_LIKED
      : POST_LIKE.ALREADY_DISLIKED;
  }

  public async getLikeDislikeFromPostByUserId(
    id: string
  ): Promise<LikeDislikePostDB[]> {
    switch (id) {
      case "id-mock-normal":
        return [
          {
            user_id: "id-mock-normal",
            post_id: "p002",
            like: 0,
          },
        ];

      case "id-mock-admin":
        return [
          {
            user_id: "id-mock-admin",
            post_id: "p001",
            like: 1,
          },
        ];

      case "id-mock":
        return [
          {
            user_id: "id-mock",
            post_id: "p002",
            like: 1,
          },
        ];

      default:
        return [];
    }
  }

  public removeLikeDislikeFromPostById = async (
    likeDislikePostDB: LikeDislikePostDB
  ): Promise<void> => {};

  public updateLikeDislikeFromPostById = async (
    likeDislikePostDB: LikeDislikePostDB
  ): Promise<void> => {};

  public insertLikeDislikeInPostById = async (
    likeDislikePostDB: LikeDislikePostDB
  ): Promise<void> => {};
}

import {
  LikeDislikeDB,
  POST_LIKE,
  PostDB,
  PostDBWithCreatorName,
} from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POST = "posts";
  public static TABLE_LIKES_DISLIKES = "likes_dislikes_posts";

  public insertPost = async (posttDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POST).insert(posttDB);
  };

  public getPostWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const result = await BaseDatabase.connection(PostDatabase.TABLE_POST)
      .select(
        `${PostDatabase.TABLE_POST}.id`,
        `${PostDatabase.TABLE_POST}.creator_id`,
        `${PostDatabase.TABLE_POST}.body`,
        `${PostDatabase.TABLE_POST}.likes`,
        `${PostDatabase.TABLE_POST}.dislikes`,
        `${PostDatabase.TABLE_POST}.created_at`,
        `${PostDatabase.TABLE_POST}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POST}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );

    return result as PostDBWithCreatorName[];
  };

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POST)
      .select()
      .where({ id });

    return result as PostDB | undefined;
  };

  public updatePost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POST)
      .update(postDB)
      .where({ id: postDB.id });
  };

  public deletePostById = async (id: string): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POST)
      .delete()
      .where({ id });
  };

  public findPostWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POST)
      .select(
        `${PostDatabase.TABLE_POST}.id`,
        `${PostDatabase.TABLE_POST}.creator_id`,
        `${PostDatabase.TABLE_POST}.body`,
        `${PostDatabase.TABLE_POST}.likes`,
        `${PostDatabase.TABLE_POST}.dislikes`,
        `${PostDatabase.TABLE_POST}.created_at`,
        `${PostDatabase.TABLE_POST}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POST}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${PostDatabase.TABLE_POST}.id`]: id });

    return result as PostDBWithCreatorName | undefined;
  };

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<POST_LIKE | undefined> => {
    const [result]: Array<LikeDislikeDB | undefined> =
      await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .select()
        .where({
          user_id: likeDislikeDB.user_id,
          post_id: likeDislikeDB.post_id,
        });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(
      likeDislikeDB
    );
  };
}

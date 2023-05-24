import { CommentModel, CommentWithCreatorDB } from "./Comment";

export interface PostDB {
  id: string;
  creator_id: string;
  body: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  comments: number;
}
export interface PostDBWithCreatorName extends PostDB {
  creator_name: string;
}
export interface PostWithCommentsDB {
  id: string;
  content: string;
  comments: number;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  creator_id: string;
  creator_username: string;
  comments_post: CommentWithCreatorDB[];
}
export interface PostWithCommentsModel {
  id: string;
  content: string;
  comments: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    username: string;
  };
  commentsPost: CommentModel[];
}

export interface PostModel {
  id: string;
  body: string;
  likes: number;
  dislikes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
  };
}

export interface LikeDislikeDB {
  user_id: string;
  post_id: string;
  like: number;
}
export interface LikeDislikePostDB {
  user_id: string;
  post_id: string;
  like: number;
}

export enum POST_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKED",
}

export class Post {
  constructor(
    private id: string,
    private body: string,
    private likes: number,
    private dislikes: number,
    private comments: number,
    private createdAt: string,
    private updatedAt: string,
    private creatorId: string,
    private creatorName: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(value: string): void {
    this.id = value;
  }
  public getComment(): number {
    return this.comments;
  }

  public setComments(value: number) {
    this.comments = value;
  }
  public addComment(): void {
    this.comments++;
  }
  public removeComment(): void {
    this.comments--;
  }

  public getBody(): string {
    return this.body;
  }

  public setBody(value: string): void {
    this.body = value;
  }

  public getLikes(): number {
    return this.likes;
  }

  public setLikes(value: number): void {
    this.likes = value;
  }

  public addLike = (): void => {
    this.likes++;
  };

  public removeLike = (): void => {
    this.likes--;
  };

  public getDislikes(): number {
    return this.dislikes;
  }

  public setDislikes(value: number): void {
    this.dislikes = value;
  }

  public addDislike = (): void => {
    this.dislikes++;
  };

  public removeDislike = (): void => {
    this.dislikes--;
  };

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public setCreatedAt(value: string): void {
    this.createdAt = value;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  public setUpdatedAt(value: string): void {
    this.updatedAt = value;
  }

  public getCreatorId(): string {
    return this.creatorId;
  }

  public setCreatorId(value: string): void {
    this.creatorId = value;
  }

  public getCreatorName(): string {
    return this.creatorName;
  }

  public setCreatorName(value: string): void {
    this.creatorName = value;
  }

  public toDBModel(): PostDB {
    return {
      id: this.id,
      creator_id: this.creatorId,
      body: this.body,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      comments: this.comments,
      updated_at: this.updatedAt,
    };
  }

  public toBusinessModel(): PostModel {
    return {
      id: this.id,
      body: this.body,
      likes: this.likes,
      dislikes: this.dislikes,
      comments: this.comments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      creator: {
        id: this.creatorId,
        name: this.creatorName,
      },
    };
  }
  public toBusinessModelWithComments(
    commentsPost: CommentModel[]
  ): PostWithCommentsModel {
    return {
      id: this.id,
      content: this.body,
      comments: this.comments,
      likes: this.likes,
      dislikes: this.dislikes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      creator: {
        id: this.creatorId,
        username: this.creatorName,
      },
      commentsPost: commentsPost,
    };
  }
}

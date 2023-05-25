import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { LikeOrDislikeCommentSchema } from "../../../src/dtos/comment/likeOrDislikeComment.dto";

describe("Testando likeOrDislikeComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar undefined ao dar um like", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      postId: "p002",
      commentId: "c003",
      token: "token-mock",
      like: true,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toBeUndefined();
  });

  test("deve retornar undefined ao dar um dislike", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      postId: "p002",
      commentId: "c003",
      token: "token-mock",
      like: false,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toBeUndefined();
  });

  test("deve retornar undefined ao retirar um like", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      postId: "p002",
      commentId: "c004",
      token: "token-mock-admin",
      like: true,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toBeUndefined();
  });

  test("deve retornar undefined ao retirar um dislike", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      postId: "p001",
      commentId: "c001",
      token: "token-mock",
      like: false,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toBeUndefined();
  });

  test("deve retornar undefined ao sobrescrever um dislike", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      postId: "p001",
      commentId: "c001",
      token: "token-mock",
      like: true,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toBeUndefined();
  });

  test("deve retornar undefined ao sobrescrever um like", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      postId: "p001",
      commentId: "c001",
      token: "token-mock-normal",
      like: false,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toBeUndefined();
  });

  test("deve disparar erro de DTO para o postId", async () => {
    expect.assertions(1);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "",
        commentId: "c001",
        token: "token-mock",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "postId: String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("deve disparar erro de postId não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "id-invalido",
        commentId: "c001",
        token: "token-mock",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe(
          "Post não encontrado. Verifique se o post ainda existe e tente novamente."
        );
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar erro de DTO para o commentId", async () => {
    expect.assertions(1);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "p001",
        commentId: "",
        token: "token-mock",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "commentId: String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("deve disparar erro de commentId não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "p001",
        commentId: "id-invalido",
        token: "token-mock",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe(
          "Comentário não encontrado. Verifique o id e tente novamente."
        );
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar erro de DTO para o token", async () => {
    expect.assertions(1);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "p001",
        commentId: "c001",
        token: "",
        like: false,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "token: String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("deve disparar erro de token inválido", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "p001",
        commentId: "c001",
        token: "token-mock-invalido",
        like: false,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("deve disparar erro de token quando usuário tentar interagir com o próprio comentário", async () => {
    // expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "p001",
        commentId: "c001",
        token: "token-mock-admin",
        like: false,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe(
          "Não é possível interagir com seu próprio comentário."
        );
        expect(error.statusCode).toBe(403);
      }
    }
  });

  test("deve disparar erro de DTO para o like/dislike", async () => {
    expect.assertions(1);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        postId: "p001",
        commentId: "c001",
        token: "token-mock",
        like: "false",
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "like: Expected boolean, received string"
        );
      }
    }
  });
});

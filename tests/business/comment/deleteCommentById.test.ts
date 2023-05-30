import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFoundError";

import { DeleteCommentByIdSchema } from "../../../src/dtos/comment/deleteCommentById.dto";

describe("Testando deleteCommentById", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar mensagem de exclusão concluída com sucesso", async () => {
    const input = DeleteCommentByIdSchema.parse({
      postId: "p001",
      commentId: "c001",
      token: "token-mock-admin",
    });

    const output = await commentBusiness.deleteCommentById(input);

    expect(output).toEqual({
      message: "Comentário excluído com sucesso!",
    });
  });

  test("deve disparar erro de DTO para o postId", async () => {
    expect.assertions(1);
    try {
      const input = DeleteCommentByIdSchema.parse({
        postId: "",
        commentId: "c001",
        token: "token-mock-admin",
      });

      const output = await commentBusiness.deleteCommentById(input);
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
      const input = DeleteCommentByIdSchema.parse({
        postId: "id-invalido",
        commentId: "c002",
        token: "token-mock-normal",
      });

      const output = await commentBusiness.deleteCommentById(input);
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
      const input = DeleteCommentByIdSchema.parse({
        postId: "p001",
        commentId: "",
        token: "token-mock-admin",
      });

      const output = await commentBusiness.deleteCommentById(input);
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
      const input = DeleteCommentByIdSchema.parse({
        postId: "p001",
        commentId: "c006",
        token: "token-mock-admin",
      });

      const output = await commentBusiness.deleteCommentById(input);
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
      const input = DeleteCommentByIdSchema.parse({
        postId: "p001",
        commentId: "c001",
        token: "",
      });

      const output = await commentBusiness.deleteCommentById(input);
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
      const input = DeleteCommentByIdSchema.parse({
        postId: "p001",
        commentId: "c001",
        token: "token-mock-invalido",
      });

      const output = await commentBusiness.deleteCommentById(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("deve disparar erro de token quando não for admin ou o próprio usuário", async () => {
    // expect.assertions(2);
    try {
      const input = DeleteCommentByIdSchema.parse({
        postId: "p001",
        commentId: "c003",
        token: "token-mock",
      });

      const output = await commentBusiness.deleteCommentById(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe(
          "Somente o autor do comentário, o autor do post ou um ADMIN podem excluir o comentário. Caso não tenha acesso a sua conta, entre em contato com nosso suporte."
        );
        expect(error.statusCode).toBe(403);
      }
    }
  });
});

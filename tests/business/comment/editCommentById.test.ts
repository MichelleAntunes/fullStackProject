import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { EditCommentByIdSchema } from "../../../src/dtos/comment/editComment.dto";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";

describe("Testando editCommentById", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retorna mensagem de atualização concluída ao enviar a edição", async () => {
    const input = EditCommentByIdSchema.parse({
      postId: "p001",
      commentId: "c001",
      content: "Conteúdo teste de um comentário",
      token: "token-mock-admin",
    });

    const output = await commentBusiness.editCommentById(input);

    expect(output).toEqual({
      message: "Comentário atualizado com sucesso!",
    });
  });

  test("deve disparar erro de DTO para postId", async () => {
    expect.assertions(1);
    try {
      const input = EditCommentByIdSchema.parse({
        postId: "",
        commentId: "c001",
        content: "Conteúdo teste de um comentário",
        token: "token-mock-normal",
      });

      const output = await commentBusiness.editCommentById(input);
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
      const input = EditCommentByIdSchema.parse({
        postId: "id-invalido",
        commentId: "c001",
        content: "Conteúdo teste de um comentário",
        token: "token-mock-normal",
      });

      const output = await commentBusiness.editCommentById(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe(
          "Post não encontrado. Verifique o id e tente novamente."
        );
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar erro de DTO para commentId", async () => {
    expect.assertions(1);
    try {
      const input = EditCommentByIdSchema.parse({
        postId: "p001",
        commentId: "",
        content: "Conteúdo teste de um comentário",
        token: "token-mock-normal",
      });

      const output = await commentBusiness.editCommentById(input);
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
      const input = EditCommentByIdSchema.parse({
        postId: "p001",
        commentId: "id-invalido",
        content: "Conteúdo teste de um comentário",
        token: "token-mock-normal",
      });

      const output = await commentBusiness.editCommentById(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe(
          "Comentário não encontrado. Verifique o id e tente novamente."
        );
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar erro de DTO para content", async () => {
    expect.assertions(1);
    try {
      const input = EditCommentByIdSchema.parse({
        postId: "p001",
        commentId: "c001",
        content: "",
        token: "token-mock-normal",
      });

      const output = await commentBusiness.editCommentById(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "content: String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("deve disparar erro de DTO para token", async () => {
    expect.assertions(1);
    try {
      const input = EditCommentByIdSchema.parse({
        postId: "p001",
        commentId: "c001",
        content: "Conteúdo teste de um comentário",
        token: "",
      });

      const output = await commentBusiness.editCommentById(input);
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
      const input = EditCommentByIdSchema.parse({
        postId: "p001",
        commentId: "c001",
        content: "Conteúdo teste de um comentário",
        token: "token-mock-invalido",
      });

      const output = await commentBusiness.editCommentById(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido.");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("deve disparar erro de token quando não for admin ou o próprio usuário", async () => {
    expect.assertions(2);
    try {
      const input = EditCommentByIdSchema.parse({
        postId: "p001",
        commentId: "c001",
        content: "Conteúdo teste de um comentário",
        token: "token-mock",
      });

      const output = await commentBusiness.editCommentById(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe(
          "Somente o criador do comentário ou um ADMIN podem editá-lo. Caso não tenha acesso a sua conta, entre em contato com nosso suporte."
        );
        expect(error.statusCode).toBe(403);
      }
    }
  });
});

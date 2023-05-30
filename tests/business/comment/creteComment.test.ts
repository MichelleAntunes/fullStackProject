import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { CreateCommentSchema } from "../../../src/dtos/comment/createComment.dto";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe("Testando createComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retorna mensagem de comentário criado com sucesso", async () => {
    const input = CreateCommentSchema.parse({
      postId: "p001",
      content: "Conteúdo teste de um comentário",
      token: "token-mock",
    });

    const output = await commentBusiness.createComment(input);

    expect(output).toEqual({
      message: "Comentário criado com sucesso!",
    });
  });

  test("deve disparar erro de DTO para postId", async () => {
    expect.assertions(1);
    try {
      const input = CreateCommentSchema.parse({
        postId: "",
        content: "Conteúdo teste de um comentário",
        token: "token-mock",
      });

      const output = await commentBusiness.createComment(input);
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
      const input = CreateCommentSchema.parse({
        postId: "id-invalida",
        content: "Conteúdo teste de um comentário",
        token: "token-mock",
      });

      const output = await commentBusiness.createComment(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe(
          "Post não encontrado. Verifique o id e tente novamente."
        );
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar erro de DTO para content", async () => {
    expect.assertions(1);
    try {
      const input = CreateCommentSchema.parse({
        postId: "p001",
        content: "",
        token: "token-mock",
      });

      const output = await commentBusiness.createComment(input);
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
      const input = CreateCommentSchema.parse({
        postId: "p001",
        content: "Conteúdo teste de um comentário",
        token: "",
      });

      const output = await commentBusiness.createComment(input);
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
      const input = CreateCommentSchema.parse({
        postId: "p001",
        content: "Conteúdo teste de um comentário",
        token: "token-mock-invalido",
      });

      const output = await commentBusiness.createComment(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });
});

import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { PostDatabase } from "../../src/database/PostDatabase";

describe("Testando createPost", () => {
  const postDatabase: PostDatabase = new PostDatabaseMock();
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retorna mensagem de post criado com sucesso", async () => {
    const input = CreatePostSchema.parse({
      content: "Conteúdo teste de um post",
      token: "token-mock-normal",
    });

    const output = await postBusiness.createPost(input);

    expect(output).toEqual({
      message: "Post criado com sucesso!",
    });
  });

  test("deve disparar erro de DTO para content", async () => {
    expect.assertions(1);
    try {
      const input = CreatePostSchema.parse({
        content: "",
        token: "token-mock-normal",
      });

      const output = await postBusiness.createPost(input);
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
      const input = CreatePostSchema.parse({
        content: "Conteúdo teste de um post",
        token: "",
      });

      const output = await postBusiness.createPost(input);
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
      const input = CreatePostSchema.parse({
        content: "Conteúdo teste de um post",
        token: "token-mock-invalido",
      });

      const output = await postBusiness.createPost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido.");
        expect(error.statusCode).toBe(401);
      }
    }
  });
});

import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { GetPostSchema } from "../../../src/dtos/post/getPost.dto";

describe("Testando getPosts", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar a lista de todos os posts", async () => {
    const input = GetPostSchema.parse({
      token: "token-mock",
    });

    const output = await postBusiness.getPosts(input);

    expect(output).toHaveLength(2);
    expect(output).toEqual([
      {
        id: "p001",
        content: "Exemplo de conteúdo de post 1",
        comments: 0,
        likes: 1,
        dislikes: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
          id: "id-mock-normal",
          username: "user_normal",
        },
      },
      {
        id: "p002",
        content: "Exemplo de conteúdo de post 2",
        comments: 0,
        likes: 1,
        dislikes: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
          id: "id-mock-admin",
          username: "user_admin",
        },
      },
    ]);
  });

  test("deve retornar a lista de todos posts que contenham a query", async () => {
    const input = GetPostSchema.parse({
      query: "post 2",
      token: "token-mock",
    });

    const output = await postBusiness.getPosts(input);

    expect(output).toHaveLength(1);
    expect(output).toEqual([
      {
        id: "p002",
        content: "Exemplo de conteúdo de post 2",
        comments: 0,
        likes: 1,
        dislikes: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
          id: "id-mock-admin",
          username: "user_admin",
        },
      },
    ]);
  });

  test("deve disparar erro de DTO para o token", async () => {
    expect.assertions(1);
    try {
      const input = GetPostSchema.parse({
        token: "",
      });

      const output = await postBusiness.getPosts(input);
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
      const input = GetPostSchema.parse({
        token: "token-mock-invalido",
      });

      const output = await postBusiness.getPosts(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido.");
        expect(error.statusCode).toBe(401);
      }
    }
  });
});

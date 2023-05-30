import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { GetPostWithCommentsByIdSchema } from "../../../src/dtos/post/getPostWithCommentsById.dto";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe("Testando getPostWithCommentsById", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar post com o id igual do input", async () => {
    const input = GetPostWithCommentsByIdSchema.parse({
      postId: "p001",
      token: "token-mock",
    });

    const output = await postBusiness.getPostWithCommentsById(input);

    expect(output).toEqual({
      id: "p001",
      content: "Exemplo de conteúdo de post 1",
      comments: 0,
      likes: 0,
      dislikes: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      creator: {
        id: "id-mock-normal",
        username: "user_normal",
      },
      commentsPost: [
        {
          id: "c001",
          content: "Exemplo de Comentário 1",
          likes: 0,
          dislikes: 0,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          creator: {
            id: "id-mock-admin",
            username: "user_admin",
          },
        },
        {
          id: "c002",
          content: "Exemplo de Comentário 2",
          likes: 0,
          dislikes: 0,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          creator: {
            id: "id-mock-normal",
            username: "user_normal",
          },
        },
      ],
    });
  });

  test("deve disparar erro de DTO para o token", async () => {
    expect.assertions(1);
    try {
      const input = GetPostWithCommentsByIdSchema.parse({
        postId: "p001",
        token: "",
      });

      const output = await postBusiness.getPostWithCommentsById(input);
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
      const input = GetPostWithCommentsByIdSchema.parse({
        postId: "p001",
        token: "token-mock-invalido",
      });

      const output = await postBusiness.getPostWithCommentsById(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("deve disparar erro de DTO para postId", async () => {
    expect.assertions(1);
    try {
      const input = GetPostWithCommentsByIdSchema.parse({
        postId: "",
        token: "token-mock",
      });

      const output = await postBusiness.getPostWithCommentsById(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "postId: String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("deve disparar erro de post não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = GetPostWithCommentsByIdSchema.parse({
        postId: "id-invalido",
        token: "token-mock-admin",
      });

      const output = await postBusiness.getPostWithCommentsById(input);
      console.log(output);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe(
          "Post não encontrado. Verifique o id e tente novamente."
        );
        expect(error.statusCode).toBe(404);
      }
    }
  });
});

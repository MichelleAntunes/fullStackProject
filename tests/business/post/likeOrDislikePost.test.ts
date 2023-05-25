import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { LikeOrDislikePostSchema } from "../../../src/dtos/post/likeOrDislikePost.dto";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe("Testando likeOrDislikePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar undefined ao dar um like", async () => {
    const input = LikeOrDislikePostSchema.parse({
      postId: "p001",
      token: "token-mock",
      like: true,
    });

    const output = await postBusiness.likeOrDislikePost(input);

    expect(output).toBeUndefined();
  });

  test("deve retornar undefined ao dar um dislike", async () => {
    const input = LikeOrDislikePostSchema.parse({
      postId: "p001",
      token: "token-mock",
      like: false,
    });

    const output = await postBusiness.likeOrDislikePost(input);

    expect(output).toBeUndefined();
  });

  test("deve disparar erro de DTO para o postId", async () => {
    expect.assertions(1);
    try {
      const input = LikeOrDislikePostSchema.parse({
        postId: "",
        token: "token-mock",
        like: true,
      });

      const output = await postBusiness.likeOrDislikePost(input);
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
      const input = LikeOrDislikePostSchema.parse({
        postId: "id-invalido",
        token: "token-mock",
        like: true,
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("post com essa id não existe");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar erro de DTO para o token", async () => {
    expect.assertions(1);
    try {
      const input = LikeOrDislikePostSchema.parse({
        postId: "p001",
        token: "",
        like: true,
      });

      const output = await postBusiness.likeOrDislikePost(input);
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
      const input = LikeOrDislikePostSchema.parse({
        postId: "p001",
        token: "token-mock-invalido",
        like: true,
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("deve disparar erro de token quando usuário tentar interagir com o próprio post", async () => {
    // expect.assertions(2);
    try {
      const input = LikeOrDislikePostSchema.parse({
        postId: "p001",
        token: "token-mock-normal",
        like: true,
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe(
          "Não é possível interagir com seu próprio post."
        );
        expect(error.statusCode).toBe(403);
      }
    }
  });

  test("deve disparar erro de DTO para o like/dislike", async () => {
    expect.assertions(1);
    try {
      const input = LikeOrDislikePostSchema.parse({
        postId: "p001",
        token: "token-mock",
        like: "true",
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "like: Expected boolean, received string"
        );
      }
    }
  });
});

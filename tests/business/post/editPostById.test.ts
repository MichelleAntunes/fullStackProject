import { PostBusiness } from "../../../src/business/PostBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { ZodError } from "zod";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { EditPostSchema } from "../../../src/dtos/post/editPost.dto";

describe("Testando editPostById", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar mensagem de atualização concluída ao enviar a edição", async () => {
    const input = EditPostSchema.parse({
      postId: "p001",
      content: "Atualização do post 1",
      token: "token-mock-normal",
    });

    const output = await postBusiness.editPost(input);

    expect(output).toEqual({
      message: "Post atualizado com sucesso!",
    });
  });

  test("deve disparar erro de DTO para o postId", async () => {
    expect.assertions(1);
    try {
      const input = EditPostSchema.parse({
        postId: "",
        content: "Atualização do post 1",
        token: "token-mock-normal",
      });

      const output = await postBusiness.editPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "body: Required"
        );
      }
    }
  });

  test("deve disparar erro de postId não encontrado", async () => {
    // expect.assertions(2);
    try {
      const input = EditPostSchema.parse({
        postId: "id-invalido",
        content: "Atualização do post 1",
        token: "token-mock-normal",
      });

      const output = await postBusiness.editPost(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe(
          "Post não encontrado. Verifique o id e tente novamente."
        );
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar erro de DTO para o token", async () => {
    expect.assertions(1);
    try {
      const input = EditPostSchema.parse({
        postId: "ip001",
        content: "Atualização do post 1",
        token: "",
      });

      const output = await postBusiness.editPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "body: Required"
        );
      }
    }
  });

  test("deve disparar erro de token inválido", async () => {
    // expect.assertions(2);
    try {
      const input = EditPostSchema.parse({
        postId: "p001",
        content: "Atualização do post 1",
        token: "token-mock-invalido",
      });

      const output = await postBusiness.editPost(input);
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
      const input = EditPostSchema.parse({
        postId: "p001",
        content: "Atualização do post 1",
        token: "token-mock",
      });

      const output = await postBusiness.editPost(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe(
          "Somente o criador ou um ADMIN podem editar o post. Caso não tenha acesso a sua conta, entre em contato com nosso suporte."
        );
        expect(error.statusCode).toBe(403);
      }
    }
  });

  test("deve disparar erro de DTO para content", async () => {
    expect.assertions(1);
    try {
      const input = EditPostSchema.parse({
        postId: "p001",
        content: "",
        token: "token-mock-normal",
      });

      const output = await postBusiness.editPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "body: Required"
        );
      }
    }
  });
});

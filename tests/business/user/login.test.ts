import { UserBusiness } from "../../../src/business/UserBusiness";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { LoginSchema } from "../../../src/dtos/user/login.dto";
import { ZodError } from "zod";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    // new PostDatabaseMock(),
    // new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar um token ao realizar login", async () => {
    const input = LoginSchema.parse({
      email: "usernormal@email.com",
      password: "Normal@123",
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({
      message: "Login realizado com sucesso!",
      token: "token-mock-normal",
    });
  });

  test("deve disparar erro de email inválido pelo DTO", async () => {
    expect.assertions(1);
    try {
      const input = LoginSchema.parse({
        email: "useremail.com",
        password: "user123",
      });

      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "email: Invalid email"
        );
      }
    }
  });

  test("deve disparar erro de senha inválida pelo DTO, deve ter pelo menos 8 caracteres", async () => {
    // expect.assertions(1);
    try {
      const input = LoginSchema.parse({
        email: "user@email.com",
        password: "user123",
      });

      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "password: String must contain at least 8 character(s)"
        );
      }
    }
  });

  test("deve disparar erro para emails não encontrados", async () => {
    expect.assertions(2);
    try {
      const input = LoginSchema.parse({
        email: "user_normal@email.com",
        password: "User@123456",
      });

      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("e-mail e/ou senha inválido(s)");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  test("deve disparar erro para senhas incorretas", async () => {
    expect.assertions(2);
    try {
      const input = LoginSchema.parse({
        email: "usernormal@email.com",
        password: "Usernormal@123",
      });

      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("e-mail e/ou senha inválido(s)");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});

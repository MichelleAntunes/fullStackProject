import { UserBusiness } from "../../../src/business/UserBusiness";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { SignupSchema } from "../../../src/dtos/user/signup.dto";
import { ZodError } from "zod";
import { ConflictError } from "../../../src/errors/ConflictError";

describe("Testando signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new PostDatabaseMock(),
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar um token ao cadastrar", async () => {
    const input = SignupSchema.parse({
      username: "usertest",
      email: "usertest@email.com",
      password: "UserTest@321",
    });

    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      message: "Cadastro realizado com sucesso!",
      token: "token-mock",
    });
  });

  test("deve disparar erro de DTO para username", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        username: "",
        email: "useremail.com",
        password: "user123",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "username: String must contain at least 2 character(s)"
        );
      }
    }
  });

  test("deve disparar erro de email inválido pelo DTO", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        username: "user_test",
        email: "useremail.com",
        password: "user123",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "email: Invalid email"
        );
      }
    }
  });

  test("deve disparar erro de senha inválida pelo DTO, deve ter pelo menos 8 caracteres", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        username: "user_test",
        email: "user@email.com",
        password: "user123",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "password: A senha deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial."
        );
      }
    }
  });

  test("deve disparar erro que não é possível criar mais de uma conta com o mesmo username", async () => {
    expect.assertions(2);
    try {
      const input = SignupSchema.parse({
        username: "user_normal",
        email: "usernormal@email.com",
        password: "User@123456",
      });

      const output = await userBusiness.signup(input);
    } catch (erro) {
      if (erro instanceof ConflictError) {
        expect(erro.message).toBe(
          "Não é possível criar mais de uma conta com o mesmo username. Tente novamente."
        );
        expect(erro.statusCode).toBe(409);
      }
    }
  });

  test("deve disparar erro que não é possível criar mais de uma conta com o mesmo email", async () => {
    expect.assertions(2);
    try {
      const input = SignupSchema.parse({
        username: "newuser",
        email: "usernormal@email.com",
        password: "User@123456",
      });

      const output = await userBusiness.signup(input);
    } catch (erro) {
      if (erro instanceof ConflictError) {
        expect(erro.message).toBe(
          "Não é possível criar mais de uma conta com o mesmo e-mail. Tente novamente."
        );
        expect(erro.statusCode).toBe(409);
      }
    }
  });
});

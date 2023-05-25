import { TokenPayload, USER_ROLES } from "../../src/models/User";

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "id-mock") {
      return "token-mock";
    } else if (payload.id === "id-mock-normal") {
      return "token-mock-normal";
    } else {
      return "token-mock-admin";
    }
  };

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-normal") {
      return {
        id: "id-mock-normal",
        name: "user_normal",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-admin") {
      return {
        id: "id-mock-admin",
        name: "user_admin",
        role: USER_ROLES.ADMIN,
      };
    } else if (token === "token-mock") {
      return {
        id: "id-mock",
        name: "user_test",
        role: USER_ROLES.NORMAL,
      };
    } else {
      return null;
    }
  };
}

export class HashManagerMock {
  public hash = async (plaintext: string): Promise<string> => {
    return "hash-mock";
  };

  public compare = async (
    plaintext: string,
    hash: string
  ): Promise<boolean> => {
    switch (plaintext) {
      case "Normal@123":
        return hash === "hash-mock-normal";

      case "Admin@123":
        return hash === "hash-mock-admin";

      case "User@123":
        return hash === "hash-mock";

      default:
        return false;
    }
  };
}

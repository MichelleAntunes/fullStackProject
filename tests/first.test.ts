describe("Praticando com Jest", () => {
  test("100 deve ser maior que 99", () => {
    expect(100).toBeGreaterThan(99);
  });

  test("100 deve ser menor que 99", () => {
    expect(100).toBeLessThan(99);
  });
});

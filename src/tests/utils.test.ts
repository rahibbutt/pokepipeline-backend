import { add, getPromiseSettledResultData } from "../utils";

type Person = {
  name: string;
  age: number;
};

describe("utils", () => {
  describe("add", () => {
    it("should add numbers correctly", () => {
      expect(add(50, 30)).toEqual(80);
    });
  });

  describe("getPromiseSettledResultData", () => {
    it("should return correct data", () => {
      const actual: PromiseSettledResult<Person>[] = [
        {
          status: "fulfilled",
          value: {
            name: "Ben",
            age: 20,
          },
        },
        {
          status: "fulfilled",
          value: {
            name: "Tim",
            age: 30,
          },
        },
      ];
      const expected = [
        {
          name: "Ben",
          age: 20,
        },
        {
          name: "Tim",
          age: 30,
        },
      ];
      expect(getPromiseSettledResultData(actual)).toEqual(expected);
    });
    it("should return correct data if not fulfilled", () => {
      const actual: PromiseSettledResult<Person>[] = [
        {
          status: "fulfilled",
          value: {
            name: "Ben",
            age: 20,
          },
        },
        {
          status: "rejected",
          reason: "Failed",
        },
      ];

      const expected = [
        {
          name: "Ben",
          age: 20,
        },
      ];

      expect(getPromiseSettledResultData(actual)).toEqual(expected);
    });
    it("should return empty array if none fulfilled", () => {
      const actual: PromiseSettledResult<Person>[] = [
        {
          status: "rejected",
          reason: "Failed",
        },
        {
          status: "rejected",
          reason: "Failed",
        },
      ];

      const expected: PromiseSettledResult<Person>[] = [];

      expect(getPromiseSettledResultData(actual)).toEqual(expected);
    });
    it("should return empty array if input is an empty array", () => {
      const actual: PromiseSettledResult<Person>[] = [];
      const expected: PromiseSettledResult<Person>[] = [];
      expect(getPromiseSettledResultData(actual)).toEqual(expected);
    });
  });
});

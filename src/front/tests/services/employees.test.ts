import { fetchEmployeesList, signupEmployee } from "~/services/employees";
import { MissingAccessTokenError } from "~/constants/errors";
import apiClient from "~/utils/apiClient";
import * as utils from "~/utils";

// Mocks
jest.mock("~/utils/apiClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
  parseApiError: jest.fn((e) => {
    if (typeof e === "string") return e;
    if (e instanceof Error) return e.message;
    return JSON.stringify(e);
  }),
}));

jest.mock("~/utils", () => ({
  getAccessTokenFromCookie: jest.fn(),
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockedGetToken = utils.getAccessTokenFromCookie as jest.Mock;

describe("employees service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchEmployeesList", () => {
    it("returns employee list when token is present", async () => {
      const mockEmployees = [
        {
          id: 1,
          first_name: "Alice",
          last_name: "Smith",
          email: "alice@example.com",
          national_id: "1234567890",
          phone_number: "09123456789",
          leave_requests_left: 5,
        },
      ];
      mockedGetToken.mockReturnValue("valid-token");
      mockedApiClient.get.mockResolvedValue({ data: mockEmployees });

      const result = await fetchEmployeesList();
      expect(result.data).toEqual(mockEmployees);
      expect(result.error).toBeUndefined();
    });

    it("returns error when token is missing", async () => {
      mockedGetToken.mockReturnValue(undefined);

      const result = await fetchEmployeesList();
      expect(result.data).toEqual([]);
      expect(result.error).toContain(MissingAccessTokenError.name);
    });

    it("handles API error gracefully", async () => {
      mockedGetToken.mockReturnValue("token-123");
      mockedApiClient.get.mockRejectedValue({
        response: { data: { detail: "Unauthorized" } },
      });

      const result = await fetchEmployeesList();
      expect(result.data).toEqual([]);
      expect(result.error).toMatch(/Unauthorized/);
    });
  });

  describe("signupEmployee", () => {
    const mockEmployee = {
      email: "new@example.com",
      first_name: "New",
      last_name: "User",
      password: "password123",
      national_id: "1234567890",
      phone_number: "09123456789",
      leave_requests_left: 10,
    };

    it("signs up new employee successfully", async () => {
      mockedGetToken.mockReturnValue("token-abc");
      mockedApiClient.post.mockResolvedValue({
        data: { ...mockEmployee, id: 1 },
      });

      const result = await signupEmployee(mockEmployee);
      expect(result.data).toMatchObject({ ...mockEmployee, id: 1 });
      expect(result.error).toBeUndefined();
    });

    it("returns error if no token is available", async () => {
      mockedGetToken.mockReturnValue(undefined);

      const result = await signupEmployee(mockEmployee);
      expect(result.data).toBeUndefined();
      expect(result.error).toContain(MissingAccessTokenError.name);
    });

    it("returns error when API fails", async () => {
      mockedGetToken.mockReturnValue("token-abc");
      mockedApiClient.post.mockRejectedValue({
        response: { data: { detail: "Email already taken" } },
      });

      const result = await signupEmployee(mockEmployee);
      expect(result.data).toBeUndefined();
      expect(result.error).toMatch(/Email already taken/);
    });
  });
});

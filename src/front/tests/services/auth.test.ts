import { fetchAuthToken, fetchUserProfile } from "~/services/auth";
import { MissingAccessTokenError } from "~/constants/errors";
import apiClient from "~/utils/apiClient";
import * as utils from "~/utils";

jest.mock("~/utils/apiClient", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
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

describe("auth service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchAuthToken", () => {
    it("returns token from cookie if available", async () => {
      mockedGetToken.mockReturnValue("existing-token");

      const result = await fetchAuthToken("email@test.com", "pass");
      expect(result).toEqual({ data: "existing-token" });
      expect(mockedApiClient.post).not.toHaveBeenCalled();
    });

    it("calls API and returns token if not in cookie", async () => {
      mockedGetToken.mockReturnValue(null);
      mockedApiClient.post.mockResolvedValue({
        data: { token: "api-token" },
      });

      const result = await fetchAuthToken("email@test.com", "pass");
      expect(result).toEqual({ data: "api-token" });
    });

    it("handles API error with detail", async () => {
      mockedGetToken.mockReturnValue(null);
      mockedApiClient.post.mockRejectedValue({
        response: { data: { detail: "Invalid credentials" } },
      });

      const result = await fetchAuthToken("wrong@test.com", "wrong");
      expect(result.error).toMatch(/Invalid credentials/);
    });

    it("handles API error with generic response data", async () => {
      mockedGetToken.mockReturnValue(null);
      mockedApiClient.post.mockRejectedValue({
        response: { data: { msg: "something went wrong" } },
      });

      const result = await fetchAuthToken("wrong@test.com", "wrong");
      expect(result.error).toMatch(/something went wrong/);
    });

    it("handles error with no response", async () => {
      mockedGetToken.mockReturnValue(null);
      mockedApiClient.post.mockRejectedValue({
        message: "Network Error",
      });

      const result = await fetchAuthToken("wrong@test.com", "wrong");
      expect(result.error).toMatch(/Network Error/);
    });

    it("handles non-Axios error", async () => {
      mockedGetToken.mockReturnValue(null);
      mockedApiClient.post.mockRejectedValue("plain error");

      const result = await fetchAuthToken("wrong@test.com", "wrong");
      expect(result.error).toMatch(/plain error/);
    });
  });

  describe("fetchUserProfile", () => {
    it("returns profile when token exists", async () => {
      mockedGetToken.mockReturnValue("token-abc");
      const fakeProfile = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        national_id: "1234567890",
        phone_number: "09123456789",
        leave_requests_left: 5,
      };

      mockedApiClient.get.mockResolvedValueOnce({
        data: fakeProfile,
      });

      const result = await fetchUserProfile();
      expect(result).toEqual({ data: fakeProfile });
    });

    it("returns error when token is missing", async () => {
      mockedGetToken.mockReturnValue(undefined);

      const result = await fetchUserProfile();
      expect(result.error).toMatch(MissingAccessTokenError.name);
    });

    it("handles API error with detail", async () => {
      mockedGetToken.mockReturnValue("token-xyz");
      mockedApiClient.get.mockRejectedValue({
        response: { data: { detail: "Unauthorized" } },
      });

      const result = await fetchUserProfile();
      expect(result.error).toMatch(/Unauthorized/);
    });

    it("handles API error with generic response data", async () => {
      mockedGetToken.mockReturnValue("token-xyz");
      mockedApiClient.get.mockRejectedValue({
        response: { data: { error: "fail" } },
      });

      const result = await fetchUserProfile();
      expect(result.error).toMatch(/fail/);
    });

    it("handles error with no response", async () => {
      mockedGetToken.mockReturnValue(null);
      mockedApiClient.post.mockRejectedValue(new Error("Network Error"));

      const result = await fetchAuthToken("wrong@test.com", "wrong");
      expect(result.error).toMatch(/Network Error/);
    });

    it("handles non-Axios error", async () => {
      mockedGetToken.mockReturnValue(null);
      mockedApiClient.post.mockRejectedValue("plain error");

      const result = await fetchAuthToken("wrong@test.com", "wrong");
      expect(result.error).toMatch(/plain error/);
    });
  });
});

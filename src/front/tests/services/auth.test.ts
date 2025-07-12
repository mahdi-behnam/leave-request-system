import { fetchAuthToken, fetchUserProfile } from "~/services/auth";
import { MissingAccessTokenError } from "~/constants/errors";
import apiClient from "~/utils/apiClient";
import * as utils from "~/utils";

// Mocks
jest.mock("~/utils/apiClient", () => ({
  post: jest.fn(),
  get: jest.fn(),
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
      expect(mockedApiClient.post).toHaveBeenCalledWith(expect.any(String), {
        username: "email@test.com",
        password: "pass",
      });
      expect(result).toEqual({ data: "api-token" });
    });

    it("handles API error gracefully", async () => {
      mockedGetToken.mockReturnValue(null);
      mockedApiClient.post.mockRejectedValue({
        response: { data: { detail: "Invalid credentials" } },
      });

      const result = await fetchAuthToken("wrong@test.com", "wrong");
      expect(result.error).toMatch(/Invalid credentials/);
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

      expect(mockedApiClient.get).toHaveBeenCalledWith(expect.any(String), {
        headers: { Authorization: "Token token-abc" },
      });
      expect(result).toEqual({ data: fakeProfile });
    });

    it("returns error when token is missing", async () => {
      mockedGetToken.mockReturnValue(undefined);

      const result = await fetchUserProfile();
      expect(result.error).toMatch(MissingAccessTokenError.name);
    });

    it("handles API error when token is present", async () => {
      mockedGetToken.mockReturnValue("token-xyz");
      mockedApiClient.get.mockRejectedValueOnce({
        response: { data: { detail: "Unauthorized" } },
      });

      const result = await fetchUserProfile();
      expect(result.error).toMatch(/Unauthorized/);
    });
  });
});

import {
  fetchLeaveRequestsList,
  createLeaveRequest,
  updateLeaveRequestStatus,
  deleteLeaveRequest,
} from "~/services/leaveRequests";

import { MissingAccessTokenError } from "~/constants/errors";
import apiClient from "~/utils/apiClient";
import * as utils from "~/utils";

jest.mock("~/utils/apiClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
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

describe("leaveRequests service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchLeaveRequestsList", () => {
    it("returns leave requests when token is present", async () => {
      const mockData = [
        {
          id: 1,
          reason: "Vacation",
          start_date: "2025-08-01",
          end_date: "2025-08-10",
          status: "PENDING",
          employee: 1,
          created_at: "2025-07-01T12:00:00Z",
        },
      ];
      mockedGetToken.mockReturnValue("valid-token");
      mockedApiClient.get.mockResolvedValue({ data: mockData });

      const result = await fetchLeaveRequestsList();
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeUndefined();
    });

    it("returns error when token is missing", async () => {
      mockedGetToken.mockReturnValue(undefined);

      const result = await fetchLeaveRequestsList();
      expect(result.data).toEqual([]);
      expect(result.error).toContain(MissingAccessTokenError.name);
    });

    it("handles API error", async () => {
      mockedGetToken.mockReturnValue("valid-token");
      mockedApiClient.get.mockRejectedValue({
        response: { data: { detail: "Unauthorized" } },
      });

      const result = await fetchLeaveRequestsList();
      expect(result.data).toEqual([]);
      expect(result.error).toMatch(/Unauthorized/);
    });
  });

  describe("createLeaveRequest", () => {
    const mockRequest = {
      reason: "Family trip",
      start_date: "2025-07-20",
      end_date: "2025-07-25",
      employee: 1,
    };

    it("creates leave request successfully", async () => {
      mockedGetToken.mockReturnValue("valid-token");
      mockedApiClient.post.mockResolvedValue({
        data: {
          ...mockRequest,
          id: 1,
          created_at: "2025-07-01",
          status: "PENDING",
        },
      });

      const result = await createLeaveRequest(mockRequest);
      expect(result.data?.id).toBe(1);
      expect(result.error).toBeUndefined();
    });

    it("returns error if no token", async () => {
      mockedGetToken.mockReturnValue(undefined);

      const result = await createLeaveRequest(mockRequest);
      expect(result.data).toBeUndefined();
      expect(result.error).toContain(MissingAccessTokenError.name);
    });

    it("returns error if API fails", async () => {
      mockedGetToken.mockReturnValue("token");
      mockedApiClient.post.mockRejectedValue({
        response: { data: { detail: "Bad request" } },
      });

      const result = await createLeaveRequest(mockRequest);
      expect(result.data).toBeUndefined();
      expect(result.error).toMatch(/Bad request/);
    });
  });

  describe("updateLeaveRequestStatus", () => {
    it("updates status successfully", async () => {
      mockedGetToken.mockReturnValue("token");
      mockedApiClient.put.mockResolvedValue({
        data: { status: "approved" },
      });

      const result = await updateLeaveRequestStatus(123, "approved");
      expect(result.data).toEqual({ status: "approved" });
    });

    it("returns error if no token", async () => {
      mockedGetToken.mockReturnValue(null);

      const result = await updateLeaveRequestStatus(1, "rejected");
      expect(result.data).toBeUndefined();
      expect(result.error).toContain(MissingAccessTokenError.name);
    });

    it("handles API error", async () => {
      mockedGetToken.mockReturnValue("token");
      mockedApiClient.put.mockRejectedValue({
        response: { data: { detail: "Invalid status" } },
      });

      const result = await updateLeaveRequestStatus(1, "INVALID" as any);
      expect(result.error).toMatch(/Invalid status/);
    });
  });

  describe("deleteLeaveRequest", () => {
    it("deletes leave request successfully", async () => {
      mockedGetToken.mockReturnValue("token");
      mockedApiClient.delete.mockResolvedValue({ status: 204 });

      const result = await deleteLeaveRequest(5);
      expect(result.error).toBeUndefined();
    });

    it("returns error if no token", async () => {
      mockedGetToken.mockReturnValue(undefined);

      const result = await deleteLeaveRequest(5);
      expect(result.error).toContain(MissingAccessTokenError.name);
    });

    it("returns error if API call fails", async () => {
      mockedGetToken.mockReturnValue("token");
      mockedApiClient.delete.mockRejectedValue({
        response: { data: { detail: "Not found" } },
      });

      const result = await deleteLeaveRequest(999);
      expect(result.error).toMatch(/Not found/);
    });
  });
});

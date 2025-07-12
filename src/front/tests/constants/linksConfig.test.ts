import {
  buildLeaveRequestStatusUpdateUrl,
  buildLeaveRequestDeleteUrl,
  BASE_API_URL,
} from "~/constants/linksConfig";

describe("Leave Request URL Builders", () => {
  describe("buildLeaveRequestStatusUpdateUrl", () => {
    it("builds correct URL for given ID", () => {
      const id = 42;
      const expected = `${BASE_API_URL}/leave-requests/${id}/status/`;
      expect(buildLeaveRequestStatusUpdateUrl(id)).toBe(expected);
    });

    it("handles zero ID", () => {
      const expected = `${BASE_API_URL}/leave-requests/0/status/`;
      expect(buildLeaveRequestStatusUpdateUrl(0)).toBe(expected);
    });
  });

  describe("buildLeaveRequestDeleteUrl", () => {
    it("builds correct URL for given ID", () => {
      const id = 101;
      const expected = `${BASE_API_URL}/leave-requests/${id}/delete/`;
      expect(buildLeaveRequestDeleteUrl(id)).toBe(expected);
    });

    it("handles large ID", () => {
      const id = 999999;
      const expected = `${BASE_API_URL}/leave-requests/${id}/delete/`;
      expect(buildLeaveRequestDeleteUrl(id)).toBe(expected);
    });
  });
});

import { signupSupervisor } from "~/services/supervisors";
import apiClient from "~/utils/apiClient";

jest.mock("~/utils/apiClient", () => ({
  post: jest.fn(),
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("supervisors service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signupSupervisor", () => {
    const newSupervisor = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      national_id: "1234567890",
      phone_number: "09123456789",
      password: "securepass",
    };

    it("signs up supervisor successfully", async () => {
      mockedApiClient.post.mockResolvedValue({
        data: {
          ...newSupervisor,
          id: 1,
          date_joined: "2025-07-01",
          role: "SUPERVISOR",
        },
      });

      const result = await signupSupervisor(newSupervisor);
      expect(result.data).toMatchObject({
        ...newSupervisor,
        id: 1,
        role: "SUPERVISOR",
      });
      expect(result.error).toBeUndefined();
    });

    it("returns error when API call fails", async () => {
      mockedApiClient.post.mockRejectedValue({
        response: { data: { detail: "Email already exists" } },
      });

      const result = await signupSupervisor(newSupervisor);
      expect(result.data).toBeUndefined();
      expect(result.error).toMatch(/Email already exists/);
    });

    it("handles unknown API error structure", async () => {
      mockedApiClient.post.mockRejectedValue({
        response: { data: null },
      });

      const result = await signupSupervisor(newSupervisor);
      expect(result.data).toBeUndefined();
      expect(result.error).toMatch(/Error/);
    });
  });
});

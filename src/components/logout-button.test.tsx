import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/authentication/authenticationSlice";
import { LogoutButton } from "./logout-button";

// Mock the necessary hooks and functions
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/hooks", () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock("@/lib/features/authentication/authenticationSlice", () => ({
  logout: jest.fn(),
}));

describe("src/components/logout-button.tsx", () => {
  it("should dispatch logout action and navigate to /signup on click", () => {
    const dispatch = jest.fn();
    const push = jest.fn();
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
    (useRouter as jest.Mock).mockReturnValue({ push });

    const { getByRole } = render(<LogoutButton />);
    const button = getByRole("button");

    fireEvent.click(button);

    expect(dispatch).toHaveBeenCalledWith(logout());
    expect(push).toHaveBeenCalledWith("/signup");
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { LoginDialog } from "./login-dialog";
import { authenticationSlice } from "@/lib/features/authentication/authenticationSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    authentication: authenticationSlice.reducer,
  },
});

describe("src/components/login-dialog.tsx", () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login dialog", () => {
    render(
      <Provider store={mockStore}>
        <LoginDialog>
          <button>Open Dialog</button>
        </LoginDialog>
      </Provider>
    );

    fireEvent.click(screen.getByText("Open Dialog"));

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(
      screen.getByText("Faça login para acessar sua conta.")
    ).toBeInTheDocument();
  });

  it("shows validation errors when form is submitted empty", async () => {
    render(
      <Provider store={mockStore}>
        <LoginDialog>
          <button>Open Dialog</button>
        </LoginDialog>
      </Provider>
    );

    fireEvent.click(screen.getByText("Open Dialog"));
    fireEvent.click(screen.getByText("Acessar"));

    await waitFor(() => {
      expect(screen.getByText("Digite seu e-mail.")).toBeInTheDocument();
      expect(screen.getByText("Digite sua senha.")).toBeInTheDocument();
    });
  });

  it("submits the form successfully", async () => {
    const mockDispatch = jest.fn().mockResolvedValue({});
    jest.spyOn(mockStore, "dispatch").mockImplementation(mockDispatch);

    render(
      <Provider store={mockStore}>
        <LoginDialog>
          <button>Open Dialog</button>
        </LoginDialog>
      </Provider>
    );

    fireEvent.click(screen.getByText("Open Dialog"));

    fireEvent.change(screen.getByPlaceholderText("Digite seu e-mail"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Acessar"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows an error toast on login failure", async () => {
    const mockDispatch = jest.fn().mockRejectedValue(new Error("Login failed"));
    jest.spyOn(mockStore, "dispatch").mockImplementation(mockDispatch);

    render(
      <Provider store={mockStore}>
        <LoginDialog>
          <button>Open Dialog</button>
        </LoginDialog>
      </Provider>
    );

    fireEvent.click(screen.getByText("Open Dialog"));

    fireEvent.change(screen.getByPlaceholderText("Digite seu e-mail"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Acessar"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        description: "Login failed",
        duration: 2000,
      });
    });
  });
});

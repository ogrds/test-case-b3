/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { SignupForm } from "./signup-form";
import { authenticationSlice } from "@/lib/features/authentication/authenticationSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { userEvent } from "@testing-library/user-event";

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || "mouse";
  }
}

window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.HTMLElement.prototype.releasePointerCapture = jest.fn();
window.HTMLElement.prototype.hasPointerCapture = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

const store = configureStore({
  reducer: {
    authentication: authenticationSlice.reducer,
  },
});

describe("src/components/auth/signup-form.tsx", () => {
  const user = userEvent.setup();
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it("renders the signup form", () => {
    render(
      <Provider store={store}>
        <SignupForm />
      </Provider>
    );

    expect(screen.getByText("Cadastro")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jhon")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(screen.getByText("Selecione seu país")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("jhon.doe@example.com")
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(
      <Provider store={store}>
        <SignupForm />
      </Provider>
    );

    fireEvent.click(screen.getByText("Criar conta"));

    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("Sobrenome é obrigatório")).toBeInTheDocument();
      expect(
        screen.getByText("Por favor, selecione seu país.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Por favor, insira seu e-mail.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Por favor, insira sua senha.")
      ).toBeInTheDocument();
    });
  });

  it("submits the form with valid data", async () => {
    const mockDispatch = jest.fn().mockResolvedValue({});
    jest.spyOn(store, "dispatch").mockImplementation(mockDispatch);

    render(
      <Provider store={store}>
        <SignupForm />
      </Provider>
    );

    const trigger = screen.getByRole("combobox", {
      name: "Country",
    });
    expect(trigger).toBeInTheDocument();
    expect(within(trigger).getByText("Selecione seu país")).toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("option", { name: "Brazil" })).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "Brazil" }));

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(within(trigger).getByText("Brazil")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Jhon"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Doe"), {
      target: { value: "Doe" },
    });

    screen.debug();

    fireEvent.change(screen.getByPlaceholderText("jhon.doe@example.com"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("******"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Criar conta"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows error toast on submission failure", async () => {
    const mockDispatch = jest
      .fn()
      .mockRejectedValue(new Error("Register failed"));
    jest.spyOn(store, "dispatch").mockImplementation(mockDispatch);

    render(
      <Provider store={store}>
        <SignupForm />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Jhon"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Doe"), {
      target: { value: "Doe" },
    });
    const trigger = screen.getByRole("combobox", {
      name: "Country",
    });
    expect(trigger).toBeInTheDocument();
    expect(within(trigger).getByText("Selecione seu país")).toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("option", { name: "Brazil" })).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "Brazil" }));

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(within(trigger).getByText("Brazil")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("jhon.doe@example.com"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("******"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Criar conta"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        description: "Register failed",
        duration: 2000,
      });
    });
  });
});

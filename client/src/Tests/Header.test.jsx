import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "../Components/Header";
import React from "react";

describe("Header Component", () => {
  // Test 1: show Home,Login,register
  it("renders Home and Login/Register links when user is not logged in", () => {
    render(
      <MemoryRouter>
        <Header user={null} />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  // Test 2
  it("renders role-specific link when user is logged in", () => {
    const user = { role: "student" };
    render(
      <MemoryRouter>
        <Header user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText("Student")).toBeInTheDocument();
  });

  it("renders Teacher link if user is teacher", () => {
    const user = { role: "teacher" };
    render(
      <MemoryRouter>
        <Header user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText("Teacher")).toBeInTheDocument();
  });

  it("renders Admin link if user is admin", () => {
    const user = { role: "admin" };
    render(
      <MemoryRouter>
        <Header user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  // Test 4:Logout
  it("opens profile dropdown and calls onLogout", () => {
    const onLogout = vi.fn();
    const user = { role: "student" };

    render(
      <MemoryRouter>
        <Header user={user} onLogout={onLogout} />
      </MemoryRouter>
    );

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();

    const logoutBtn = screen.getByText("Logout");
    fireEvent.click(logoutBtn);

    expect(onLogout).toHaveBeenCalled();
  });
});

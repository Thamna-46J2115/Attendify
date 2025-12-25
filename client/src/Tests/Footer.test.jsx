import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Components/Footer";
import React from "react";

describe("Footer Component", () => {
  it("renders the Footer component", () => {
    render(<Footer />);
    const footerElement = screen.getByText(/© 2025 Attendify/i);
    expect(footerElement).toBeInTheDocument();
  });

  it("has the class 'footer'", () => {
    render(<Footer />);
    const footerElement = screen.getByText(/© 2025 Attendify/i);
    expect(footerElement).toHaveClass("footer");
  });

  it("contains developer names", () => {
    render(<Footer />);
    const footerElement = screen.getByText(/Thamna & Aya/i);
    expect(footerElement).toBeInTheDocument();
  });
});

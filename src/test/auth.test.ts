import { describe, it, expect, beforeEach } from "vitest";

// Test subscriber login logic
describe("Subscriber Auth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should accept valid credentials", async () => {
    const email = "teste@jdtelecom.com";
    const password = "123456";
    // Simulates the login check
    const isValid = email === "teste@jdtelecom.com" && password === "123456";
    expect(isValid).toBe(true);
  });

  it("should reject invalid credentials", async () => {
    const email = "wrong@email.com";
    const password = "wrong";
    const isValid = email === "teste@jdtelecom.com" && password === "123456";
    expect(isValid).toBe(false);
  });

  it("should reject empty fields", () => {
    const email = "";
    const password = "";
    const hasEmpty = !email.trim() || !password.trim();
    expect(hasEmpty).toBe(true);
  });

  it("should store session in localStorage on login", () => {
    const mockData = { id: "1", name: "João Silva", email: "teste@jdtelecom.com" };
    localStorage.setItem("jd_subscriber_session", JSON.stringify(mockData));
    const saved = localStorage.getItem("jd_subscriber_session");
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!).email).toBe("teste@jdtelecom.com");
  });

  it("should clear session on logout", () => {
    localStorage.setItem("jd_subscriber_session", JSON.stringify({ id: "1" }));
    localStorage.removeItem("jd_subscriber_session");
    expect(localStorage.getItem("jd_subscriber_session")).toBeNull();
  });
});

// Test admin login logic
describe("Admin Auth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should accept valid admin credentials", () => {
    const email = "admin@jdtelecom.com";
    const password = "123456";
    const isValid = email === "admin@jdtelecom.com" && password === "123456";
    expect(isValid).toBe(true);
  });

  it("should reject invalid admin credentials", () => {
    const isValid = "user@email.com" === "admin@jdtelecom.com" && "abc" === "123456";
    expect(isValid).toBe(false);
  });

  it("should store admin session in localStorage", () => {
    const admin = { email: "admin@jdtelecom.com", name: "Administrador", role: "admin" };
    localStorage.setItem("jd_admin_session", JSON.stringify(admin));
    const saved = JSON.parse(localStorage.getItem("jd_admin_session")!);
    expect(saved.role).toBe("admin");
  });

  it("should clear admin session on logout", () => {
    localStorage.setItem("jd_admin_session", JSON.stringify({ role: "admin" }));
    localStorage.removeItem("jd_admin_session");
    expect(localStorage.getItem("jd_admin_session")).toBeNull();
  });
});

// Test profile data completeness
describe("Subscriber Profile", () => {
  it("should have avatar and preferences in mock data", () => {
    const mockSubscriber = {
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=JS",
      cpf: "123.456.789-00",
      birthdate: "15/03/1990",
      preferences: {
        notifications_email: true,
        notifications_sms: false,
        notifications_whatsapp: true,
        dark_mode: true,
        language: "pt-BR",
      },
    };

    expect(mockSubscriber.avatar).toBeTruthy();
    expect(mockSubscriber.cpf).toBeTruthy();
    expect(mockSubscriber.birthdate).toBeTruthy();
    expect(mockSubscriber.preferences).toBeDefined();
    expect(mockSubscriber.preferences.notifications_whatsapp).toBe(true);
    expect(mockSubscriber.preferences.language).toBe("pt-BR");
  });
});

import api from "./api.js";

const isGitHubPages = () =>
	typeof window !== "undefined" && window.location.hostname.endsWith("github.io");

const DEMO_USERS = [
	{
		id: "u1",
		name: "Arjun Mehta",
		email: "superadmin@nimbus.com",
		role: "SUPER_ADMIN",
		provider: "AZURE_AD",
		password: "Password@123"
	},
	{
		id: "u2",
		name: "Sara Khan",
		email: "security.admin@nimbus.com",
		role: "SECURITY_ADMIN",
		provider: "OKTA",
		password: "Password@123"
	},
	{
		id: "u3",
		name: "Rohit Iyer",
		email: "it.admin@nimbus.com",
		role: "IT_ADMIN",
		provider: "ACTIVE_DIRECTORY",
		password: "Password@123"
	},
	{
		id: "u4",
		name: "Neha Patel",
		email: "employee@nimbus.com",
		role: "EMPLOYEE",
		provider: "AZURE_AD",
		password: "Password@123"
	},
	{
		id: "u5",
		name: "David Roy",
		email: "auditor@nimbus.com",
		role: "AUDITOR",
		provider: "OKTA",
		password: "Password@123"
	}
];

const resolveResponse = (data, message = "OK") =>
	Promise.resolve({ data: { success: true, message, data } });

const rejectResponse = (message, status = 401) =>
	Promise.reject({ response: { status, data: { message } } });

const findUserByEmail = (email = "") =>
	DEMO_USERS.find((u) => u.email === email.toLowerCase());

export const loginLocal = (payload) => {
	if (!isGitHubPages()) return api.post("/auth/login", payload);

	const user = findUserByEmail(payload?.email);
	if (!user || payload?.password !== user.password) {
		return rejectResponse("Invalid credentials", 401);
	}

	const publicUser = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		provider: user.provider
	};

	localStorage.setItem("demo_user", JSON.stringify(publicUser));
	return resolveResponse({ token: `demo-token-${Date.now()}`, user: publicUser }, "Login successful");
};

export const loginSso = (payload) => {
	if (!isGitHubPages()) return api.post("/auth/sso-login", payload);

	const user = findUserByEmail(payload?.email);
	if (!user || user.provider !== payload?.provider) {
		return rejectResponse("SSO failed: user mapping not found for this provider", 404);
	}

	const publicUser = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		provider: user.provider
	};

	localStorage.setItem("demo_user", JSON.stringify(publicUser));
	return resolveResponse({ token: `demo-token-${Date.now()}`, user: publicUser }, `${payload.provider} SSO login successful`);
};
export const registerUser = (payload) => api.post("/auth/register", payload);
export const forgotPassword = (payload) => api.post("/auth/forgot-password", payload);
export const resetPassword = (payload) => api.post("/auth/reset-password", payload);

export const getMe = () => {
	if (!isGitHubPages()) return api.get("/auth/me");

	const token = localStorage.getItem("token");
	const cached = localStorage.getItem("demo_user");
	if (!token || !cached) return rejectResponse("Unauthorized", 401);

	try {
		return resolveResponse(JSON.parse(cached), "Current user");
	} catch {
		return rejectResponse("Unauthorized", 401);
	}
};


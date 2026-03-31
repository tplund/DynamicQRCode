// Global test setup
// Mock environment variables for tests
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.NEXTAUTH_SECRET = "test-secret-for-vitest";
process.env.NEXTAUTH_URL = "http://localhost:3000";

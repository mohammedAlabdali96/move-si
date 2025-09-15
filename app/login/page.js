export const metadata = {
  title: "Login · Movie Discovery",
};

export default function LoginPage() {
  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      <form method="post" action="/api/auth/login?redirect=/">
        <label className="block mb-2">
          Username
          <input name="username" className="border p-2 w-full" required />
        </label>

        <label className="block mb-4">
          Password
          <input
            name="password"
            type="password"
            className="border p-2 w-full"
            required
          />
        </label>

        <button className="border px-4 py-2">Sign in</button>
      </form>
    </main>
  );
}

"use client";
import Link from "next/link";

export default function Error({ error, reset }) {

  const status = error?.status;
  let message = error?.message || "Something went wrong.";

  if (status === 429) {
    const ra = error?.retryAfter || "a little while";
    message = `Too many requests. Try again in ${ra}.`;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold">Oops</h1>
      <p className="mt-2 text-sm text-gray-700">{message}</p>

      {status === 401 && (
        <p className="mt-3 text-sm">
          Please{" "}
          <Link className="underline" href="/login">
            log in
          </Link>{" "}
          and try again.
        </p>
      )}

      <button className="underline mt-4" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import Link from "next/link";

function HeartIcon({ filled }) {
  return filled ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M12 21s-7.3-4.7-9.6-8.2C.5 10 1.5 6.9 4.2 6 6 5.4 7.9 6 9 7.5 10.1 6 12 5.4 13.8 6c2.7.9 3.7 4 1.8 6.8C19.3 16.3 12 21 12 21Z"
        className="fill-rose-500"
      />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M12 21s-7.3-4.7-9.6-8.2C.5 10 1.5 6.9 4.2 6c1.8-.6 3.7 0 4.8 1.5C10.1 6 12 5.4 13.8 6c2.7.9 3.7 4 1.8 6.8C19.3 16.3 12 21 12 21Z"
        className="fill-none stroke-rose-500"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function FavoriteButton({
  movieId,
  initialFavorite,
  isAuthed = false,
  redirectPath = "/",
}) {
  if (!isAuthed) {
    const next = encodeURIComponent(redirectPath);
    return (
      <p className="mt-3 text-sm text-neutral-600">
        To save favorites, please{" "}
        <Link href={`/login?next=${next}`} className="font-medium underline">
          log in
        </Link>
        .
      </p>
    );
  }

  const [fav, setFav] = useState(Boolean(initialFavorite));
  const inflight = useRef(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (inflight.current) return;

    const target = !fav;
    setFav(target);
    inflight.current = true;

    try {
      const url = `/api/movies/${movieId}/favorite${
        target ? "" : "?method=delete"
      }`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("toggle failed");
    } catch {
      setFav(!target);
    } finally {
      inflight.current = false;
    }
  }

  const qs = new URLSearchParams();
  if (fav) qs.set("method", "delete");
  qs.set("redirect", redirectPath);
  const action = `/api/movies/${movieId}/favorite?${qs.toString()}`;

  return (
    <form method="post" action={action} onSubmit={onSubmit} className="mt-3">
      <button
        aria-pressed={fav}
        disabled={inflight.current}
        className={[
          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
          "transition-colors duration-150",
          fav
            ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        ].join(" ")}
      >
        <HeartIcon filled={fav} />
        {fav ? "Remove from favorites" : "Add to favorites"}
      </button>
    </form>
  );
}

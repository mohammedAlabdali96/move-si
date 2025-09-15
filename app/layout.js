import "./globals.css";

import Header from "@/components/Header";

export const metadata = {
  title: "Movie Discovery",
  description: "Next.js app with SSR browsing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}

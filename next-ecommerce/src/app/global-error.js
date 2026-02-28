"use client";

export default function GlobalError({ error, reset }) {
  const isChunkLoad = error?.name === "ChunkLoadError" || error?.message?.includes?.("Loading chunk");
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: "32rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          {isChunkLoad ? "Page load failed" : "Something went wrong"}
        </h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          {isChunkLoad
            ? "The app failed to load. Try refreshing the page."
            : error?.message || "An error occurred."}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.5rem 1rem",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Refresh page
        </button>
      </body>
    </html>
  );
}

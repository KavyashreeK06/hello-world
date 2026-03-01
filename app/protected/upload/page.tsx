"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [cdnUrl, setCdnUrl] = useState<string | null>(null);
  const [captions, setCaptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setCaptions([]);
    setCdnUrl(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/captions", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setCdnUrl(data.cdnUrl);
      setCaptions(data.captions ?? []);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Upload image → captions</h1>

      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={onSubmit} disabled={!file || loading}>
          {loading ? "Working..." : "Upload & Generate Captions"}
        </button>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {cdnUrl && (
        <>
          <h2>Uploaded</h2>
          <img src={cdnUrl} alt="uploaded" style={{ maxWidth: "100%", borderRadius: 8 }} />
        </>
      )}

      {captions.length > 0 && (
        <>
          <h2>Captions</h2>
          <ol>
            <ol style={{ lineHeight: "1.8" }}>
              {captions.map((c) => (
                <li key={c.id}>{c.content}</li>
              ))}
            </ol>
          </ol>
        </>
      )}
    </main>
  );
}
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const API_BASE = "https://api.almostcrackd.ai";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
]);

export async function POST(req: Request) {
  // 0) Require login + get JWT (Supabase session access token)
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const token = data.session?.access_token;
  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // 1) Read file from multipart/form-data
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Expected a form field named 'file'." }, { status: 400 });
  }

  const contentType = file.type;
  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${contentType}` },
      { status: 400 }
    );
  }

  // Step 1: presign
  const presignRes = await fetch(`${API_BASE}/pipeline/generate-presigned-url`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contentType }),
  });

  if (!presignRes.ok) {
    const details = await presignRes.text();
    return NextResponse.json({ error: "Presign failed", details }, { status: presignRes.status });
  }

  const { presignedUrl, cdnUrl } = await presignRes.json();

  // Step 2: PUT bytes to S3 presigned URL
  const putRes = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType, // must match Step 1
    },
    body: file,
  });

  if (!putRes.ok) {
    const details = await putRes.text();
    return NextResponse.json(
      { error: "Upload to presigned URL failed", details },
      { status: putRes.status }
    );
  }

  // Step 3: register image URL
  const registerRes = await fetch(`${API_BASE}/pipeline/upload-image-from-url`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
  });

  if (!registerRes.ok) {
    const details = await registerRes.text();
    return NextResponse.json(
      { error: "Register image failed", details },
      { status: registerRes.status }
    );
  }

  const { imageId } = await registerRes.json();

  // Step 4: generate captions
  const captionsRes = await fetch(`${API_BASE}/pipeline/generate-captions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageId }),
  });

  if (!captionsRes.ok) {
    const details = await captionsRes.text();
    return NextResponse.json(
      { error: "Generate captions failed", details },
      { status: captionsRes.status }
    );
  }

  const captions = await captionsRes.json();

  return NextResponse.json({ cdnUrl, imageId, captions });
}
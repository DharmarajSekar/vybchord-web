import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "uploads";

// File signatures, so a renamed executable cannot pass as a document.
const TYPES = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] },
  doc: { mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] },
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    magic: [0x50, 0x4b, 0x03, 0x04],
  },
} as const;

type UploadResult = { ok: true; path: string } | { ok: false; message: string };

/** Tech spec §4 step 5: stores a document in the private `uploads` bucket. */
export async function uploadDocument(file: File, folder: "leads" | "cvs"): Promise<UploadResult> {
  const ext = file.name.toLowerCase().split(".").pop() as keyof typeof TYPES;
  const type = TYPES[ext];
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!type || !type.magic.every((byte, i) => bytes[i] === byte)) {
    return { ok: false, message: "This file does not look like a valid PDF or Word document." };
  }

  const path = `${folder}/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await createAdminClient()
    .storage.from(BUCKET)
    .upload(path, bytes, { contentType: type.mime, upsert: false });
  if (error) {
    console.error("[uploads] upload failed", error.message);
    return { ok: false, message: "We could not upload your file. Please try again." };
  }
  return { ok: true, path };
}

/** Removes an upload when the row that references it could not be saved. */
export async function removeUpload(path: string) {
  const { error } = await createAdminClient().storage.from(BUCKET).remove([path]);
  if (error) console.error("[uploads] cleanup failed", path, error.message);
}

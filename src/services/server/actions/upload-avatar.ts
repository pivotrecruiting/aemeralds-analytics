"use server";

import type { UserAvatarT } from "@/lib/dal";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadAvatar({
  avatar,
  base64,
  fileName,
  fileType,
  id,
  timestamp,
  table = "user",
}: {
  avatar?: UserAvatarT;
  base64: string;
  fileName: string;
  fileType: string;
  id: string;
  timestamp: string;
  table: "user";
}): Promise<{ publicUrl: string | null; error: Error | null }> {
  const supabase = await createClient();

  if (base64.length === 0)
    return { publicUrl: null, error: new Error("No Avatar selected!") };

  const buffer = Buffer.from(base64, "base64");

  const uniqueFileName = `${id}_${timestamp}_${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(`${table}-avatar`)
    .upload(uniqueFileName, buffer, {
      contentType: fileType,
    });

  if (uploadError) {
    console.error("Fehler beim Hochladen des Avatars:", uploadError);
    return { publicUrl: null, error: uploadError };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(`${table}-avatar`).getPublicUrl(uniqueFileName);

  if (!publicUrl) {
    console.error(
      "Fehler beim Abrufen der öffentlichen URL: URL ist nicht verfügbar"
    );
    return { publicUrl: null, error: new Error("URL ist nicht verfügbar") };
  }

  const updatedAvatar = {
    id: crypto.randomUUID(),
    url: publicUrl,
    fileName: uniqueFileName,
    fileSize: buffer.length,
    fileType: fileType,
    uploadDate: timestamp,
    ...(table === "user" && { userId: id }),
    thumbnailUrl: "",
  };

  const { error } = await supabase
    .from(`${table}s`)
    .update({ avatar: updatedAvatar })
    .eq("id", id)
    .select();
  if (error) {
    console.error(
      "Fehler beim Aktualisieren des Avatars in der Datenbank: ",
      error
    );
    throw new Error("Fehler beim Aktualisieren des Avatars");
  }

  if (avatar) {
    // Delete file from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(`${table}-avatar`)
      .remove([`${avatar.fileName}`]);

    if (deleteError) {
      throw new Error(
        "Fehler beim Löschen der Datei aus dem Storage: " + deleteError.message
      );
    }
  }

  revalidatePath("/", "layout");

  return { publicUrl, error: null };
}

"use client";

import { useRef, useState } from "react";
import { uploadAvatar } from "@/services/server/actions/upload-avatar";
import { toast } from "sonner";
import sanitizeFilename from "@/utils/helpers/sanitize-filename";
import { Button } from "@/components/ui/button";
import type { GenderT, UserAvatarT } from "@/lib/dal";
import { setAvatarUrl } from "@/utils/helpers/set-avatar-url";
import Pencil from "@/components/svg/pencil";

// Maximum Dateigröße in Bytes (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function AvatarInput({
  id,
  avatar,
  gender,
}: {
  id: string;
  avatar?: UserAvatarT | null;
  gender: GenderT;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // allowed file types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    // check if file type is allowed
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Nicht unterstütztes Dateiformat. Nur .jpg, .jpeg, .png, .webp und .svg sind erlaubt."
      );
      return;
    }

    // check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `Datei ist zu groß. Die maximale Dateigröße beträgt ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB.`
      );
      return;
    }

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const response = await uploadAvatar({
        avatar,
        base64,
        fileName: sanitizeFilename(file.name),
        fileType: file.type,
        id,
        timestamp: new Date().toISOString(),
        table: "user",
      });

      if (response.error) {
        // Spezifische Fehlermeldungen basierend auf dem Fehlertyp
        const errorMessage = response.error.message || "Upload fehlgeschlagen";

        if (
          errorMessage.includes("Datei zu groß") ||
          errorMessage.includes("file size")
        ) {
          throw new Error(
            "Die Datei ist zu groß. Bitte wählen Sie ein kleineres Bild."
          );
        } else if (errorMessage.includes("URL ist nicht verfügbar")) {
          throw new Error(
            "Die Bild-URL konnte nicht generiert werden. Bitte versuchen Sie es später erneut."
          );
        } else if (
          errorMessage.includes("Storage") ||
          errorMessage.includes("upload")
        ) {
          throw new Error(
            "Fehler beim Speichern des Avatars. Bitte versuchen Sie es später erneut."
          );
        } else {
          throw new Error(errorMessage);
        }
      }

      if (!response)
        throw new Error("Upload fehlgeschlagen: Keine Antwort vom Server");

      if (response.publicUrl) {
        toast.success("Avatar erfolgreich hochgeladen!");
      }
    } catch (error: unknown) {
      console.error("Upload fehlgeschlagen:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Das Avatar konnte nicht hochgeladen werden. Versuchen Sie es bitte später erneut."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div
      className="relative z-10 mt-10 aspect-square size-32 rounded-full bg-cover bg-right"
      style={{
        backgroundImage: `url('${
          setAvatarUrl({
            avatarUrl: avatar?.url || null,
            gender: gender || null,
          }) || ""
        }')`,
      }}
    >
      <Button
        aria-label="Avatar ändern"
        size="icon"
        className="absolute right-0 bottom-0 z-20 p-0"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <Pencil />
      </Button>
      <input
        ref={fileInputRef}
        id={`file-upload-${id}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
}

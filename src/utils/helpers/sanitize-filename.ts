export default function sanitizeFilename(filename: string) {
  return filename
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "_") // space to _ (underscore)
    .replace(/[^\w\-.]/g, ""); // removes not allowed characters
}

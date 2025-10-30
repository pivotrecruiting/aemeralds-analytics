export type ApiResponseT = {
  type: "message" | "toast";
  error: boolean;
  success: boolean;
  title?: string;
  message?: string;
};

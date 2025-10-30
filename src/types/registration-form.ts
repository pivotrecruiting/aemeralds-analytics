import type { GenderT } from "@/lib/dal";

export type FormDataT = {
  gender: GenderT;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  terms_agb: boolean;
  terms_privacy: boolean;
  terms_usage: boolean;
  school_id?: string;
  class_id?: string;
  role?: string;
};

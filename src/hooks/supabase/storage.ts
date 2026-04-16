import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function uploadImage(bucket: string, file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) { toast.error("Erro no upload: " + error.message); return null; }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

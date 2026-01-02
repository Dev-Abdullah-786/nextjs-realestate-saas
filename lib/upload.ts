import { createClient } from "@supabase/supabase-js";

export async function uploadImages(images: File[]): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env variables missing");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const uploads = await Promise.all(
    images.map((file) =>
      supabase.storage
        .from("propertyImages")
        .upload(`${file.name}_${Date.now()}`, file)
    )
  );

  return uploads
    .map((item) =>
      item.data?.path
        ? supabase.storage.from("propertyImages").getPublicUrl(item.data.path)
            .data.publicUrl
        : null
    )
    .filter((url): url is string => Boolean(url));
}

export async function uploadAvatar(image: File): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env variables missing");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(`${image.name}_${Date.now()}`, image);

  if (error || !data?.path) {
    console.error(error);
    return null;
  }

  return supabase.storage.from("avatars").getPublicUrl(data.path).data
    .publicUrl;
}

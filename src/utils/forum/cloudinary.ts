export async function uploadImage(file: File) {
  const signResponse = await fetch("/api/sign-cloudinary", { method: "POST" });
  const signData = await signResponse.json();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signData.apiKey as string);
  formData.append("timestamp", signData.timestamp as string);
  formData.append("signature", signData.signature as string);
  formData.append("folder", signData.folder as string);
  formData.append("image_metadata", "true");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();

  if (data.error) {
    throw Error(data.error.message as string);
  }

  return {
    url: data.secure_url as string,
    originalFilename: data.original_filename as string,
    width: data.width as number,
    dpi: Number(data.image_metadata.DPI),
  };
}

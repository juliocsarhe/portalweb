export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const preset = import.meta.env.VITE_CLOUDINARY_PRESET

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", preset)

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Error al subir imagen, intente de nuevo")
  }

  const data = await res.json()
  return data.secure_url 
}
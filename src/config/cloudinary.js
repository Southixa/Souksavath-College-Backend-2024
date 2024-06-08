import cloudinary from "cloudinary";
cloudinary.config({
  cloud_name: "docl6igdw",
  api_key: "945332527494631",
  api_secret: "zGxo1lQO009p1EjeJoXWrnfrQuo",
});

export const UploadToCloudinary = async (files, oldImage) => {
  try {
    if (oldImage) {
      const spliturl = oldImage.split("/");
      const img_id = spliturl[spliturl.length - 1].split(".")[0];
      await cloudinary.uploader.destroy(img_id);
    }
    const base64 = files.toString("base64");
    const imgPath = `data:image/jpeg;base64,${base64}`;
    const cloudinaryUpload = await cloudinary.uploader.upload(imgPath, {
      public_id: `IMG_${Date.now()}`,
      resource_type: "auto",
    });
    return cloudinaryUpload.url;
  } catch (error) {
    console.log(error);
    return ""
  }
};

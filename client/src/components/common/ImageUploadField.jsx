import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../../api/uploadApi";

const getUploadedImageUrl = (response) => {
  return (
    response?.data?.url ||
    response?.data?.secure_url ||
    response?.data?.secureUrl ||
    response?.url ||
    response?.secure_url ||
    response?.secureUrl ||
    response?.imageUrl ||
    response?.fileUrl ||
    ""
  );
};

const ImageUploadField = ({ label = "Image", value, onChange }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,

    onSuccess: (response) => {
      const uploadedUrl = getUploadedImageUrl(response);

      if (!uploadedUrl) {
        setErrorMessage("Image uploaded, but URL was not found in response.");
        return;
      }

      setErrorMessage("");
      onChange(uploadedUrl);
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to upload image.";
      setErrorMessage(message);
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setErrorMessage("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Only image files are allowed.");
      return;
    }

    uploadImageMutation.mutate(file);
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-2 w-full rounded-lg border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-green-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-green-800"
      />

      {uploadImageMutation.isPending && (
        <p className="mt-2 text-sm text-slate-500">Uploading image...</p>
      )}

      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}

      {value && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">Uploaded Image</p>

          <img
            src={value}
            alt="Uploaded preview"
            className="mt-3 h-40 w-full rounded-lg object-cover"
          />

          <p className="mt-2 break-all text-xs text-slate-400">{value}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;

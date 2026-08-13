import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { uploadPdf } from "../api/uploadApi";

const AdminUploadPdfsPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const uploadPdfMutation = useMutation({
    mutationFn: uploadPdf,

    onSuccess: (response) => {
      setErrorMessage("");
      setUploadedPdf(response.data || response);
      setSelectedFile(null);
    },

    onError: (error) => {
      const message = error.response?.data?.message || "Failed to upload PDF.";

      setUploadedPdf(null);
      setErrorMessage(message);
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setErrorMessage("");
    setUploadedPdf(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setSelectedFile(null);
      setErrorMessage("Only PDF files are allowed.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please select a PDF file first.");
      return;
    }

    setErrorMessage("");
    uploadPdfMutation.mutate(selectedFile);
  };

  const uploadedUrl =
    uploadedPdf?.url ||
    uploadedPdf?.secure_url ||
    uploadedPdf?.pdfUrl ||
    uploadedPdf?.fileUrl ||
    "";

  return (
    <DashboardLayout title="Upload PDFs">
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Upload Contract PDF
            </h3>

            <p className="text-sm text-slate-500">
              Upload contract templates or legal PDF documents to cloud storage.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Select PDF File
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mt-2 w-full rounded-lg border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-green-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-green-800"
              />
            </div>

            {selectedFile && (
              <div className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-700">
                  Selected File
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!selectedFile || uploadPdfMutation.isPending}
                className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
              >
                {uploadPdfMutation.isPending ? "Uploading..." : "Upload PDF"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Upload Result
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            After upload, the PDF URL will appear here.
          </p>

          {!uploadedPdf ? (
            <div className="mt-6 rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No PDF uploaded yet.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                PDF uploaded successfully.
              </div>

              {uploadedUrl ? (
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Uploaded URL
                  </p>

                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm font-medium text-green-700 hover:underline"
                  >
                    {uploadedUrl}
                  </a>
                </div>
              ) : (
                <pre className="max-h-60 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                  {JSON.stringify(uploadedPdf, null, 2)}
                </pre>
              )}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AdminUploadPdfsPage;

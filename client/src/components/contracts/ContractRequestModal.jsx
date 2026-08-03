import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createContractRequest,
  getContractTemplates,
} from "../../api/contractApi";

const initialFormData = {
  templateId: "",
  cropName: "",
  quantity: "",
  proposedPrice: "",
  startDate: "",
  endDate: "",
  message: "",
};

const ContractRequestModal = ({ land, onClose, onRequestCreated }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: templatesResponse,
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
  } = useQuery({
    queryKey: ["contract-templates"],
    queryFn: getContractTemplates,
  });

  const templates = templatesResponse?.data || [];

  const createRequestMutation = useMutation({
    mutationFn: createContractRequest,
    onSuccess: () => {
      onRequestCreated();
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create contract request.";

      setErrorMessage(message);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrorMessage("");

    createRequestMutation.mutate({
      landId: land.id,
      templateId: formData.templateId,
      cropName: formData.cropName,
      quantity: formData.quantity,
      proposedPrice: Number(formData.proposedPrice),
      startDate: formData.startDate,
      endDate: formData.endDate,
      message: formData.message,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Request Contract
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Send a contract farming request for:
            </p>

            <p className="mt-2 font-semibold text-green-700">{land.title}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {isTemplatesError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load contract templates.
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Contract Template
            </label>

            <select
              name="templateId"
              value={formData.templateId}
              onChange={handleChange}
              required
              disabled={isTemplatesLoading}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="">
                {isTemplatesLoading
                  ? "Loading templates..."
                  : "Select template"}
              </option>

              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title || template.type?.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Crop Name
            </label>

            <input
              type="text"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              required
              placeholder="Wheat"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Quantity
            </label>

            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              placeholder="50 quintals"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Proposed Price
            </label>

            <input
              type="number"
              name="proposedPrice"
              value={formData.proposedPrice}
              onChange={handleChange}
              required
              min="1"
              placeholder="40000"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Start Date
            </label>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              End Date
            </label>

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Message
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              placeholder="I want to create a contract farming agreement for this land."
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createRequestMutation.isPending}
              className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {createRequestMutation.isPending
                ? "Sending..."
                : "Send Contract Request"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ContractRequestModal;

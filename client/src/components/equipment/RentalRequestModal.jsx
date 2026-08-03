import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createRentalRequest } from "../../api/equipmentApi";

const initialFormData = {
  startDate: "",
  endDate: "",
  message: "",
};

const RentalRequestModal = ({ equipment, onClose, onRequestCreated }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState("");

  const createRentalMutation = useMutation({
    mutationFn: createRentalRequest,

    onSuccess: () => {
      onRequestCreated();
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create rental request.";

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

    createRentalMutation.mutate({
      equipmentId: equipment.id,
      startDate: formData.startDate,
      endDate: formData.endDate,
      message: formData.message,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <section className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Request Equipment Rental
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Send rental request for:
            </p>

            <p className="mt-2 font-semibold text-green-700">
              {equipment.title}
            </p>
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

        <form onSubmit={handleSubmit} className="grid gap-5">
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

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Message
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              placeholder="I want to rent this equipment for farming work."
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createRentalMutation.isPending}
              className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {createRentalMutation.isPending
                ? "Sending..."
                : "Send Rental Request"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default RentalRequestModal;

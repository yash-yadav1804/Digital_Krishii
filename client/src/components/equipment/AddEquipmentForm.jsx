import { useState } from "react";
import { createEquipment } from "../../api/equipmentApi";
import ImageUploadField from "../common/ImageUploadField.jsx";

const initialFormData = {
  title: "",
  equipmentType: "",
  description: "",
  brand: "",
  modelName: "",
  condition: "",
  rentPrice: "",
  priceUnit: "PER_DAY",
  imageUrl: "",
  address: "",
  district: "",
  state: "",
  pincode: "",
};

const AddEquipmentForm = ({ onEquipmentCreated, onCancel }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrl,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);
    if (!formData.imageUrl) {
      setErrorMessage(
        "Please upload an equipment image before creating the listing.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await createEquipment({
        ...formData,
        rentPrice: Number(formData.rentPrice),
      });

      setFormData(initialFormData);
      onEquipmentCreated();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create equipment listing.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Add New Equipment
          </h3>

          <p className="text-sm text-slate-500">
            Create an equipment listing for rental.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Mahindra Tractor for Rent"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Equipment Type
          </label>

          <input
            type="text"
            name="equipmentType"
            value={formData.equipmentType}
            onChange={handleChange}
            required
            placeholder="Tractor"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Condition
          </label>

          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            placeholder="Good"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Powerful tractor suitable for ploughing and farming work."
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Mahindra"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Model Name
          </label>

          <input
            type="text"
            name="modelName"
            value={formData.modelName}
            onChange={handleChange}
            placeholder="575 DI"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Rent Price
          </label>

          <input
            type="number"
            name="rentPrice"
            value={formData.rentPrice}
            onChange={handleChange}
            required
            min="1"
            placeholder="1500"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Price Unit
          </label>

          <select
            name="priceUnit"
            value={formData.priceUnit}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="PER_HOUR">Per Hour</option>
            <option value="PER_DAY">Per Day</option>
            <option value="PER_WEEK">Per Week</option>
            <option value="PER_MONTH">Per Month</option>
          </select>
        </div>

        <ImageUploadField
          label="Equipment Image"
          value={formData.imageUrl}
          onChange={handleImageChange}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Address
          </label>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Near Indrapuri, Bhopal"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            District
          </label>

          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            placeholder="Bhopal"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            State
          </label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            placeholder="Madhya Pradesh"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Pincode
          </label>

          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            placeholder="462021"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting || !formData.imageUrl}
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
          >
            {isSubmitting ? "Creating..." : "Create Equipment"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddEquipmentForm;

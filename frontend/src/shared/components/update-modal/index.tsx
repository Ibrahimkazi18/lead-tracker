"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
}

interface UpdateModalProps {
  plan: Plan;
  onClose: () => void;
  onSubmit: (updatedPlan: Omit<Plan, "id">) => void;
}

const UpdateModal = ({ plan, onClose, onSubmit }: UpdateModalProps) => {
  const [name, setName] = useState(plan.name);
  const [description, setDescription] = useState(plan.description);
  const [price, setPrice] = useState(plan.price.toString());
  const [duration, setDuration] = useState(plan.duration.toString());

  useEffect(() => {
    setName(plan.name);
    setDescription(plan.description);
    setPrice(plan.price.toString());
    setDuration(plan.duration.toString());
  }, [plan]);

  const handleSubmit = () => {
    if (!name || !description || !price || !duration) return;

    onSubmit({
      name,
      description,
      price: parseInt(price),
      duration: parseInt(duration),
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[480px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl font-semibold text-white">Update Plan</h3>
          <button
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 mt-5">
          <div>
            <label className="block text-sm text-gray-200 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              placeholder="Plan name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              placeholder="Plan description"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Price (₹)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              placeholder="Plan price"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Duration (days)</label>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              type="number"
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              placeholder="Plan duration"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2 transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition font-semibold"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;

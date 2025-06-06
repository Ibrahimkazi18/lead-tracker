"use client"

import { X } from "lucide-react";
import { useState } from "react";

interface ConvertModalProps {
  title : string;
  description : string;
  onClose : () => void;
  onConfirm : (expectedRevenue : number) => void;
}

const ConvertModal = ({ title, onClose, description, onConfirm } : ConvertModalProps) => {
  const [expectedRevenue, setExpectedRevenue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const revenue = parseFloat(expectedRevenue);
    if (isNaN(revenue) || revenue <= 0) {
      setError("Please enter a valid expected revenue amount.");
      return;
    }

    onConfirm(revenue);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[450px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Convert Lead</h3>

            <button
                className="text-gray-400 hover:text-white"
                onClick={onClose}
            >
                <X size={22} />
            </button>
        </div>

        {/* Info */}
        <p className="mt-4 text-gray-400">
          You're about to convert{" "}
          <span className="font-semibold text-white">{description}</span>.
        </p>

        {/* Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Expected Revenue (in ₹)</label>
          <input
            type="number"
            placeholder="Enter expected amount"
            value={expectedRevenue}
            onChange={(e) => setExpectedRevenue(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>


        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2 transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition font-semibold"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConvertModal
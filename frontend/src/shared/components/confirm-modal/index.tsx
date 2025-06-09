"use client"

import { X } from "lucide-react";

interface ConfirmModalProps {
  title : string;
  description : string;
  onClose : () => void;
  onConfirm : () => void;
}

const ConfirmModal = ({ title, onClose, description, onConfirm } : ConfirmModalProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[450px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Confirm Payment</h3>

            <button
                className="text-gray-400 hover:text-white"
                onClick={onClose}
            >
                <X size={22} />
            </button>
        </div>

        {/* Warning message */}
        <p className="mt-4 text-gray-400">
          Are you sure you want to confirm payment of {" "}
          <span className="font-semibold text-white">{title}</span> ?
          <br />
          This action cannot be undone.
        </p>

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
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
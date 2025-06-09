"use client"

import { X } from "lucide-react";

interface SetDefaultModalProps {
  title : string;
  description : string;
  onClose : () => void;
  onConfirm : () => void;
}

const SetDefaultModal = ({ title, onClose, description, onConfirm } : SetDefaultModalProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[450px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Set Default: {title}</h3>

            <button
                className="text-gray-400 hover:text-white"
                onClick={onClose}
            >
                <X size={22} />
            </button>
        </div>

        {/* Warning message */}
        <p className="mt-4 text-gray-400">
          Are you sure you want to set {" "}
          <span className="font-semibold text-white">{description}</span> ?
          <br />
          as default plan.
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

export default SetDefaultModal
"use client"

import { LeadType } from "@/app/(routes)/dashboard/all-leads/page";
import { X } from "lucide-react";
import { useState } from "react";

interface AddVisitModalProps {
  title : string;
  description : string;
  lead : LeadType;
  onClose : () => void;
  onConfirm : (data : { description: string; images: string[] }) => void;
}

const AddVisitModal = ({ title, onClose, description, onConfirm } : AddVisitModalProps) => {
  const [visitDescription, setVisitDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Convert files to Base64 strings
  const convertFilesToBase64 = async (files: File[]) => {
    const promises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    return Promise.all(promises);
  };

  const handleConfirm = async () => {
    if(selectedFiles.length > 0){
      const base64Images = await convertFilesToBase64(selectedFiles);
      onConfirm({ description: visitDescription, images: base64Images });
    }
    else {
      onConfirm({ description: visitDescription, images: [] });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[450px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Add Visit</h3>

            <button
                className="text-gray-400 hover:text-white"
                onClick={onClose}
            >
                <X size={22} />
            </button>
        </div>

        {/* Description message */}
        <p className="mt-4 text-gray-400 mb-4">
          You are adding a visit for{" "}
          <span className="font-semibold text-white">{description}</span>.
        </p>

        {/* Description Input */}
        <label className="block text-white mb-2">Visit Description</label>
        <textarea
          className="w-full p-2 bg-gray-700 text-white rounded-md mb-4"
          placeholder="Write something about the visit..."
          rows={4}
          value={visitDescription}
          onChange={(e) => setVisitDescription(e.target.value)}
        />

        {/* Image Input */}
        <label className="block text-white mb-2">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="block w-full text-white"
          onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
        />

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
            disabled={!visitDescription}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddVisitModal
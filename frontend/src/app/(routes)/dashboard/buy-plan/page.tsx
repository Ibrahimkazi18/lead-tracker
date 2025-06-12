"use client";

import useAgent from "@/hooks/useAgent";
import { usePlanStatus } from "@/hooks/usePlan";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const SubscriptionPlansPage = () => {
  const { agent } = useAgent();
  const { isPlanActive } = usePlanStatus();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const yourUpiId = process.env.NEXT_PUBLIC_UPI_ID as string;
    console.log("id: ", yourUpiId);
    setUpiId(yourUpiId);
  }, [])

  const yourName = process.env.NEXT_PUBLIC_UPI_ID as string;
  
  const { data : plans } = useQuery({
    queryKey : ["plans"],
    queryFn : async () => {
      const response = await axiosInstance.get(`/get-all-plans-agent`);
      return response?.data?.plans;
    }
  });

  const getUPIUrl = (amount: number) =>
  `upi://pay?pa=${upiId}&pn=${encodeURIComponent(yourName)}&am=${amount}&cu=INR`;

  const openModal = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPaymentRef("");
  };

  const handleManualPayment = async () => {
    if (!paymentRef) {
      toast.error("Please enter UPI payment reference.");
      return;
    }

    try {
      await axiosInstance.post(`/request-subscription/${agent.id}`, {
        planId: selectedPlan.id || "",
        paymentRef,
      });

      toast.success("Payment request submitted for admin confirmation.");
      closeModal();
    } catch (err) {
      toast.error("Failed to submit payment request.");
    }
  };

  return (
    <div className="w-full min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Buy Plan</h2>
      </div>

      <div className="flex items-center">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
        <ChevronRight size={20} className="opacity-[.8]"/>
        <span className="">Available Plans</span>
      </div>

      {isPlanActive && (
        <h2 className="mt-8">You Already Have an Active Plan.</h2>
      )}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans?.map((plan: any, index: number) => {
          const active = isPlanActive;

          return (
            <div key={plan?.id} className={`bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 ${index === 1 ? "border-[#80Deea]" : ""}`}>
              {index === 1 && (
                <div className="text-sm text-[#80Deea] font-semibold mb-2">★ Most Popular</div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan?.name}</h3>
              <p className="text-gray-300 text-sm mb-4 min-h-[64px]">{plan?.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-semibold text-white">₹{plan?.price}</span>
                <span className="text-sm text-gray-400">{plan?.duration} days</span>
              </div>

              <button
                disabled={active}
                onClick={() => openModal(plan)}
                className={`w-full py-2 rounded-md font-medium transition ${
                  active
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#80Deea] hover:bg-[#4dd0e1] text-black"
                }`}
              >
                {active ? "Active Plan" : "Buy Now"}
              </button>
            </div>
          );
        })}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-[#111] rounded-lg p-6 w-full max-w-md border border-gray-700 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold text-white mb-2">UPI Manual Payment</h2>
              <p className="text-sm text-gray-400 mb-3">
                Scan & pay ₹{selectedPlan?.price} to <span className="text-[#80Deea]">{upiId}</span>
              </p>

              <div className="flex justify-center mb-4">
                <QRCodeCanvas
                  value={getUPIUrl(selectedPlan?.price || 0)}
                  size={180}
                  bgColor="#000"
                  fgColor="#fff"
                />
              </div>

              <label className="text-sm mb-1 block text-white">UPI Transaction ID</label>

              <input
                type="text"
                className="w-full p-2 mb-4 rounded bg-black border border-gray-600 text-white"
                placeholder="e.g. 3456GH78UPI"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
              />
              <button
                onClick={handleManualPayment}
                className="w-full py-2 bg-[#80Deea] text-black rounded hover:bg-[#4dd0e1] transition"
              >
                Submit Payment
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default SubscriptionPlansPage
// PaymentDetails.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";

function PaymentDetails() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          "https://tripplanner-1.onrender.com/payment"
        );
        setPayments(response.data);
      } catch (error) {
        setError("Failed to fetch payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <p>Loading payment details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-5">
        <h1 className="text-3xl font-bold text-center mb-5">Payment Details</h1>
        {payments.length === 0 ? (
          <p className="text-center text-gray-600">No payment records found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((payment) => (
              <div key={payment._id} className="p-6 bg-white shadow rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {payment.name}
                </h2>
                <p className="text-gray-600">
                  <strong>Email:</strong> {payment.email}
                </p>
                <p className="text-gray-600">
                  <strong>Mobile:</strong> {payment.mobile}
                </p>
                <p className="text-gray-600">
                  <strong>Package:</strong> {payment.packageTitle}
                </p>
                <p className="text-gray-600">
                  <strong>Amount:</strong> ₹{payment.amount}
                </p>
                <p className="text-gray-600">
                  <strong>Payment ID:</strong> {payment.paymentId}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(payment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentDetails;

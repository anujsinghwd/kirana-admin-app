import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { DisplayPriceInRupees } from "../../utils/utils";

const InvoicePage: React.FC = () => {
  const { orderId } = useParams();
  const { fetchOrderById, singleOrder, loadingConfig } = useOrders();

  useEffect(() => {
    if (orderId) fetchOrderById(orderId);
  }, [orderId]);

  if (loadingConfig.loading) {
    return <div className="text-center mt-10 text-gray-500">Loading invoice...</div>;
  }

  if (!singleOrder) {
    return <div className="text-center mt-10 text-gray-500">Invoice not found</div>;
  }

  const order = singleOrder;

  return (
    <section className="bg-gray-50 min-h-screen p-4 flex justify-center print:bg-white">
      <div className="w-full max-w-2xl bg-white shadow rounded-lg p-6 print:shadow-none print:border print:border-gray-300">
        
        {/* ---------- Header ---------- */}
        <div className="flex justify-between items-center mb-4 print:hidden">
          <button 
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-black flex items-center gap-2"
          >
            <FaArrowLeft /> Back
          </button>

          <button 
            onClick={() => window.print()}
            className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <FaPrint /> Print
          </button>
        </div>

        {/* ---------- Store Header ---------- */}
        <div className="text-center border-b pb-3">
          <h2 className="text-xl font-bold">Shivi Kirana Store</h2>
          <p className="text-sm text-gray-600">Your trusted local grocery partner</p>
        </div>

        {/* ---------- Invoice Info ---------- */}
        <div className="mt-4 text-sm">
          <div className="flex justify-between">
            <p><span className="font-semibold">Invoice No:</span> {order.orderId}</p>
            <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          {order?.delivery_address && (
            <p className="mt-1">
              <span className="font-semibold">Delivery Address:</span>  
              <br /> {`${order.delivery_address?.address_line}`}
              <br /> {`${order.delivery_address?.city}`}
              <br /> {`${order.delivery_address?.state} - ${order.delivery_address.pincode}`}
            </p>
          )}
        </div>

        {/* ---------- Table Items ---------- */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border">Item</th>
                <th className="text-center p-2 border">Qty</th>
                <th className="text-center p-2 border">Price</th>
                <th className="text-right p-2 border">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item: any, i: number) => (
                <tr key={i} className="border-b">
                  <td className="p-2 border">
                    <p className="font-medium">{item.name}</p>
                    {item.unit && (
                      <p className="text-xs text-gray-500">{item.unit}</p>
                    )}
                  </td>

                  <td className="text-center p-2 border">{item.quantity}</td>

                  <td className="text-center p-2 border">
                    {DisplayPriceInRupees(item.price)}
                  </td>

                  <td className="text-right p-2 border font-semibold">
                    {DisplayPriceInRupees(item.subTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- Price Summary ---------- */}
        <div className="mt-6 text-sm space-y-1">
          <div className="flex justify-between">
            <p className="text-gray-700">Subtotal</p>
            <p>{DisplayPriceInRupees(order.subTotalAmt)}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-700">Discount</p>
            <p>-{DisplayPriceInRupees(order.totalDiscount)}</p>
          </div>

          <div className="flex justify-between font-bold border-t pt-2">
            <p>Total Amount</p>
            <p>{DisplayPriceInRupees(order.totalAmt)}</p>
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <p className="text-center mt-6 text-xs text-gray-500 print:hidden">
          Thank you for shopping with Shivi Kirana!  
        </p>

        <p className="text-center mt-4 text-xs text-gray-500 hidden print:block">
          Invoice generated automatically — No signature required.
        </p>

      </div>
    </section>
  );
};

export default InvoicePage;

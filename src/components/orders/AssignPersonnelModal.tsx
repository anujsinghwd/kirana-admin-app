import React, { useState } from "react";
import { FaTimes, FaUserAlt } from "react-icons/fa";
import { api } from "../../api/api";
import toast from "react-hot-toast";

const roles = ["Delivery", "Picker", "Manager", "Cashier"];

type Order = {
  _id: string;
  // add other order fields as needed
};

type AssignPersonnelModalProps = {
  order: Order;
  close: () => void;
  refresh: () => void;
};

const AssignPersonnelModal: React.FC<AssignPersonnelModalProps> = ({ order, close, refresh }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("Delivery");

  const assign = async () => {
    if (!name.trim()) {
      toast.error("Enter name");
      return;
    }

    try {
      await api.put(`/orders/${order._id}/assign`, {
        name,
        contact,
        role,
      });

      toast.success("Assigned successfully");
      refresh();
      close();
    } catch {
      toast.error("Failed to assign");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-end z-50">
      <div className="bg-white w-full p-4 rounded-t-lg shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FaUserAlt /> Assign Personnel
          </h3>
          <button onClick={close}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Person Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <select
            className="w-full border rounded px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>

          <button
            onClick={assign}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignPersonnelModal;

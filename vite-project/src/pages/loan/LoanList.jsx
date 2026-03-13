import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Pencil, IndianRupee } from "lucide-react";

import { employeeAPI, authAPI, loanAPI } from "../../services/api";

const Loan = () => {

  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employeeName: "",
    employee: "",
    userId: "",
    amount: "",
    installments: "",
    interestRate: "",
    reason: ""
  });

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLoans();
    loadUsers();
    loadEmployees();
  }, []);

  const loadLoans = async () => {
    const res = await loanAPI.getAll();
    setLoans(res.data || []);
  };

  const loadUsers = async () => {
    const res = await authAPI.getAllUsers();
    setUsers(res.data || []);
  };

  const loadEmployees = async () => {
    const res = await employeeAPI.getAll();
    setEmployees(res.data || []);
  };

  const saveLoan = async () => {

    if (editId) {

      const res = await loanAPI.update(editId, form);

      setLoans(loans.map(l =>
        l._id === editId ? res.data : l
      ));

    } else {

      const res = await loanAPI.create(form);

      setLoans([res.data, ...loans]);

    }

    setShow(false);
    setEditId(null);

    setForm({
      employeeName: "",
      employee: "",
      userId: "",
      amount: "",
      installments: "",
      interestRate: "",
      reason: ""
    });

  };

  const deleteLoan = async (id) => {
    await loanAPI.delete(id);
    setLoans(loans.filter(l => l._id !== id));
  };

  const filtered = useMemo(() => {
    return loans.filter(l =>
      l.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      l.userId?.name?.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, loans]);

  return (

    <div className="p-4 md:p-10">

      <h1 className="text-2xl font-bold mb-6">Loan Management</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <input
          placeholder="Search employee or user"
          className="border p-2 md:w-80 w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button
          onClick={() => setShow(true)}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
        >
          <Plus size={16} /> Add Loan
        </button>

      </div>

      {/* ---------------- MOBILE CARD VIEW ---------------- */}

      <div className="grid gap-4 md:hidden">

        {filtered.map(l => (

          <div key={l._id} className="bg-white shadow rounded-lg p-4">

            <div className="font-bold text-lg">
              {l.employeeName}
            </div>

            <div className="text-sm text-gray-500">
              {l.userId
                ? `${l.userId.name} (${l.userId.email})`
                : "Not Assigned"}
            </div>

            <div className="flex justify-between mt-3 text-sm">

              <span className="flex items-center gap-1 text-green-600 font-semibold">
                <IndianRupee size={14} /> {l.amount}
              </span>

              <span>
                {l.installments} EMI
              </span>

            </div>

            <div className="flex gap-2 mt-4">

              <button
                className="flex-1 bg-blue-500 text-white py-1 rounded"
                onClick={() => {

                  setEditId(l._id);

                  setForm({
                    employee: l.employee?._id || "",
                    employeeName: l.employeeName,
                    userId: l.userId?._id || "",
                    amount: l.amount,
                    installments: l.installments,
                    interestRate: l.interestRate,
                    reason: l.reason
                  });

                  setShow(true);

                }}
              >
                Edit
              </button>

              <button
                className="flex-1 bg-red-500 text-white py-1 rounded"
                onClick={() => deleteLoan(l._id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ---------------- DESKTOP TABLE ---------------- */}

      <div className="hidden md:block">

        <table className="w-full border">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Employee</th>
              <th>User</th>
              <th>Amount</th>
              <th>Installments</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map(l => (

              <tr key={l._id} className="border-t">

                <td className="p-3">{l.employeeName}</td>

                <td>
                  {l.userId
                    ? `${l.userId.name} (${l.userId.email})`
                    : "Not Assigned"}
                </td>

                <td className="flex items-center gap-1">
                  <IndianRupee size={14} /> {l.amount}
                </td>

                <td>{l.installments}</td>

                <td className="flex gap-2">

                  <button
                    onClick={() => {

                      setEditId(l._id);

                      setForm({
                        employee: l.employee?._id || "",
                        employeeName: l.employeeName,
                        userId: l.userId?._id || "",
                        amount: l.amount,
                        installments: l.installments,
                        interestRate: l.interestRate,
                        reason: l.reason
                      });

                      setShow(true);

                    }}
                  >
                    <Pencil size={16} />
                  </button>

                  <button onClick={() => deleteLoan(l._id)}>
                    <Trash2 size={16} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ---------------- MODAL ---------------- */}

      {show && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">

          <div className="bg-white p-6 rounded w-full max-w-md">

            <h2 className="font-bold mb-4">
              {editId ? "Update Loan" : "Create Loan"}
            </h2>

            <select
              className="border w-full p-2 mb-3"
              value={form.employee}
              onChange={(e) => {

                const emp = employees.find(x => x._id === e.target.value);

                setForm({
                  ...form,
                  employee: e.target.value,
                  employeeName: emp?.name || ""
                });

              }}
            >

              <option value="">Select Employee</option>

              {employees.map(e => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}

            </select>

            <select
              className="border w-full p-2 mb-3"
              value={form.userId}
              onChange={e => setForm({ ...form, userId: e.target.value })}
            >

              <option value="">Assign User</option>

              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}

            </select>

            <input
              className="border w-full p-2 mb-3"
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />

            <input
              className="border w-full p-2 mb-3"
              placeholder="Installments"
              value={form.installments}
              onChange={e => setForm({ ...form, installments: e.target.value })}
            />

            <div className="flex gap-3">

              <button
                onClick={() => setShow(false)}
                className="flex-1 border py-2"
              >
                Cancel
              </button>

              <button
                onClick={saveLoan}
                className="flex-1 bg-green-600 text-white py-2"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
};

export default Loan;
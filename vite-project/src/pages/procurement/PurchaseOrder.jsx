import { useState, useEffect, useMemo } from "react";
import {
    Plus, Pencil, Trash2, X, Search, ShoppingCart, Loader2,
    CheckCircle, AlertCircle, ChevronLeft, ChevronRight, IndianRupee,
} from "lucide-react";
import { purchaseOrderAPI, vendorAPI } from "../../services/api";

const STATUS_COLORS = {
    Pending: "bg-amber-50 text-amber-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-red-50 text-red-600",
};
const PER_PAGE = 8;
const EMPTY_FORM = { vendor: "", vendorName: "", orderDate: "", expectedDelivery: "", status: "Pending", notes: "", items: [{ name: "", quantity: "", unitPrice: "", total: "" }] };
const inp = "w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100";

export default function PurchaseOrder() {
    const [rows, setRows] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [msg, setMsg] = useState({ text: "", type: "" });

    const toast = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 4000); };

    useEffect(() => {
        Promise.all([purchaseOrderAPI.getAll(), vendorAPI.getAll()])
            .then(([p, v]) => { setRows(p.data || []); setVendors(v.data || []); })
            .catch(() => toast("Failed to load.", "error"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => rows.filter(r =>
        `${r.poNumber} ${r.vendorName} ${r.vendor?.name || ""}`.toLowerCase().includes(search.toLowerCase())
    ), [rows, search]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const openAdd = () => { setEditId(null); setForm({ ...EMPTY_FORM, items: [{ name: "", quantity: "", unitPrice: "", total: "" }] }); setModal(true); };
    const openEdit = (r) => {
        setEditId(r._id);
        setForm({
            vendor: r.vendor?._id || r.vendor || "",
            vendorName: r.vendorName || r.vendor?.name || "",
            orderDate: r.orderDate?.slice(0, 10) || "",
            expectedDelivery: r.expectedDelivery?.slice(0, 10) || "",
            status: r.status,
            notes: r.notes || "",
            items: r.items?.length ? r.items.map(i => ({ name: i.name, quantity: i.quantity, unitPrice: i.unitPrice, total: i.total })) : [{ name: "", quantity: "", unitPrice: "", total: "" }],
        });
        setModal(true);
    };

    const handleVendorChange = (id) => {
        const v = vendors.find(x => x._id === id);
        setForm(p => ({ ...p, vendor: id, vendorName: v?.name || "" }));
    };

    const updateItem = (i, field, val) => {
        setForm(p => {
            const items = p.items.map((item, idx) => {
                if (idx !== i) return item;
                const updated = { ...item, [field]: val };
                if (field === "quantity" || field === "unitPrice") {
                    const qty = parseFloat(field === "quantity" ? val : item.quantity) || 0;
                    const price = parseFloat(field === "unitPrice" ? val : item.unitPrice) || 0;
                    updated.total = (qty * price).toFixed(2);
                }
                return updated;
            });
            return { ...p, items };
        });
    };

    const addItem = () => setForm(p => ({ ...p, items: [...p.items, { name: "", quantity: "", unitPrice: "", total: "" }] }));
    const removeItem = (i) => setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));
    const grandTotal = () => form.items.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);

    const handleSave = async () => {
        if (!form.vendorName.trim() || !form.items.some(i => i.name.trim())) { toast("Vendor and at least one item required.", "error"); return; }
        setSaving(true);
        try {
            const payload = {
                ...form,
                items: form.items.filter(i => i.name.trim()),
                totalAmount: grandTotal(),
            };
            if (editId) {
                const res = await purchaseOrderAPI.update(editId, payload);
                setRows(p => p.map(r => r._id === editId ? res.data : r));
                toast("Purchase order updated.");
            } else {
                const res = await purchaseOrderAPI.create(payload);
                setRows(p => [res.data, ...p]);
                toast("Purchase order created.");
            }
            setModal(false);
        } catch (e) { toast(e.message || "Save failed.", "error"); }
        finally { setSaving(false); }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await purchaseOrderAPI.delete(deleteId);
            setRows(p => p.filter(r => r._id !== deleteId));
            toast("Purchase order deleted.");
        } catch { toast("Delete failed.", "error"); }
        finally { setDeleting(false); setDeleteId(null); }
    };

    const quickStatus = async (id, status) => {
        try {
            const res = await purchaseOrderAPI.update(id, { status });
            setRows(p => p.map(r => r._id === id ? res.data : r));
        } catch { toast("Update failed.", "error"); }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8 pt-24">
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-sky-100 rounded-xl"><ShoppingCart className="text-sky-600" size={22} /></div>
                            Purchase Orders
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Create and track all purchase orders</p>
                    </div>
                    <button onClick={openAdd}
                        className="bg-[#0a4d44] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95">
                        <Plus size={18} /> New PO
                    </button>
                </div>

                {msg.text && (
                    <div className={`mb-5 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                        {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle size={14} />}{msg.text}
                    </div>
                )}

                <div className="relative max-w-sm mb-6 ml-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input placeholder="Search PO no, vendor…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-white border border-slate-100 pl-10 pr-4 py-3 rounded-2xl text-sm shadow-sm outline-none focus:ring-4 ring-sky-50" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-sky-500" size={32} /></div>
                ) : (
                    <>
                        <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                                        {["PO No", "Vendor", "Items", "Total Amount", "Order Date", "Expected Delivery", "Status", "Actions"].map(h =>
                                            <th key={h} className="px-5 py-5">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paged.length === 0 ? (
                                        <tr><td colSpan={8} className="px-6 py-16 text-center text-slate-400">{rows.length === 0 ? "No purchase orders yet." : "No results."}</td></tr>
                                    ) : paged.map(r => (
                                        <tr key={r._id} className="group hover:bg-slate-50/50 transition">
                                            <td className="px-5 py-4 text-xs font-bold text-sky-500">{r.poNumber || "—"}</td>
                                            <td className="px-5 py-4 font-bold text-slate-700 text-sm">{r.vendorName || r.vendor?.name || "—"}</td>
                                            <td className="px-5 py-4 text-sm text-slate-500">{r.items?.length || 0} item{r.items?.length !== 1 ? "s" : ""}</td>
                                            <td className="px-5 py-4 text-sm font-black text-slate-800">
                                                <span className="flex items-center gap-0.5"><IndianRupee size={11} />{(r.totalAmount || 0).toLocaleString("en-IN")}</span>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-slate-400">{r.orderDate?.slice(0, 10) || "—"}</td>
                                            <td className="px-5 py-4 text-xs text-slate-400">{r.expectedDelivery?.slice(0, 10) || "—"}</td>
                                            <td className="px-5 py-4">
                                                <select value={r.status} onChange={e => quickStatus(r._id, e.target.value)}
                                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border-0 outline-none cursor-pointer ${STATUS_COLORS[r.status]}`}>
                                                    {["Pending", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={() => openEdit(r)} className="p-2 bg-white border border-slate-100 text-blue-600 rounded-xl hover:border-blue-200"><Pencil size={13} /></button>
                                                    <button onClick={() => setDeleteId(r._id)} className="p-2 bg-white border border-slate-100 text-red-500 rounded-xl hover:border-red-200"><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden space-y-3">
                            {paged.map(r => (
                                <div key={r._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="flex justify-between mb-2">
                                        <div>
                                            <span className="text-[10px] font-bold text-sky-500">{r.poNumber}</span>
                                            <p className="font-bold text-slate-800">{r.vendorName || r.vendor?.name}</p>
                                            <p className="text-xs text-slate-500">{r.items?.length || 0} items</p>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg h-fit ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                                    </div>
                                    <p className="text-sm font-black text-slate-800 mb-3">₹{(r.totalAmount || 0).toLocaleString("en-IN")}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(r)} className="flex-1 bg-blue-50 text-blue-600 font-bold py-2 rounded-xl text-xs">Edit</button>
                                        <button onClick={() => setDeleteId(r._id)} className="flex-1 bg-red-50 text-red-500 font-bold py-2 rounded-xl text-xs">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <p className="text-[10px] font-black uppercase text-slate-400">Page {page} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-sky-600 disabled:opacity-30"><ChevronLeft size={18} /></button>
                                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-sky-600 disabled:opacity-30"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="font-black text-slate-800">{editId ? "Edit Purchase Order" : "New Purchase Order"}</h2>
                            <button onClick={() => setModal(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={20} /></button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Vendor *</label>
                                    <select value={form.vendor} onChange={e => handleVendorChange(e.target.value)} className={inp}>
                                        <option value="">— Select Vendor —</option>
                                        {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Order Date</label>
                                    <input type="date" value={form.orderDate} onChange={e => setForm({ ...form, orderDate: e.target.value })} className={inp} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Expected Delivery</label>
                                    <input type="date" value={form.expectedDelivery} onChange={e => setForm({ ...form, expectedDelivery: e.target.value })} className={inp} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                                        {["Pending", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Notes</label>
                                    <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inp} placeholder="Optional notes…" />
                                </div>
                            </div>

                            {/* Line items */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Line Items *</label>
                                    <button onClick={addItem} className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                                        <Plus size={12} /> Add Item
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {form.items.map((item, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-2xl">
                                            <div className="col-span-4">
                                                <input value={item.name} onChange={e => updateItem(i, "name", e.target.value)}
                                                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 ring-sky-100"
                                                    placeholder="Item name" />
                                            </div>
                                            <div className="col-span-2">
                                                <input type="number" min="0" value={item.quantity} onChange={e => updateItem(i, "quantity", e.target.value)}
                                                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 ring-sky-100"
                                                    placeholder="Qty" />
                                            </div>
                                            <div className="col-span-3">
                                                <input type="number" min="0" value={item.unitPrice} onChange={e => updateItem(i, "unitPrice", e.target.value)}
                                                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 ring-sky-100"
                                                    placeholder="Unit Price (₹)" />
                                            </div>
                                            <div className="col-span-2 text-sm font-black text-slate-600 text-right pr-1">
                                                {item.total ? `₹${Number(item.total).toLocaleString("en-IN")}` : "—"}
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                {form.items.length > 1 && (
                                                    <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 p-1"><X size={14} /></button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-right text-sm font-black text-slate-800 pr-10 pt-1">
                                        Grand Total: <span className="text-sky-600">₹{grandTotal().toLocaleString("en-IN")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 pb-8 flex gap-3 shrink-0">
                            <button onClick={() => setModal(false)} className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-[2] bg-[#0a4d44] text-white py-3.5 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : editId ? "Update PO" : "Create PO"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={28} /></div>
                        <h2 className="text-lg font-black text-slate-800 mb-2">Delete Purchase Order?</h2>
                        <div className="flex flex-col gap-2 mt-6">
                            <button onClick={confirmDelete} disabled={deleting}
                                className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                                {deleting ? <><Loader2 size={14} className="animate-spin" />Deleting…</> : "Confirm Delete"}
                            </button>
                            <button onClick={() => setDeleteId(null)} className="w-full py-3.5 rounded-2xl font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
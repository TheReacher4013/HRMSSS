import { useState, useEffect } from "react";

const BASE = "http://localhost:5000/api";
const tok = () => localStorage.getItem("token");
const api = async (m, url, body) => {
    const r = await fetch(`${BASE}${url}`, { method: m, headers: { Authorization: `Bearer ${tok()}`, ...(body && { "Content-Type": "application/json" }) }, body: body ? JSON.stringify(body) : undefined });
    const d = await r.json(); if (!r.ok) throw new Error(d.message); return d;
};

const PER = 5;

export default function PointCategories() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null); // null | 'add' | {edit obj}
    const [delItem, setDelItem] = useState(null);
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

    useEffect(() => { api("GET", "/point-categories").then(r => setData(r.data || [])).catch(() => { }).finally(() => setLoading(false)); }, []);

    const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
    const paginated = filtered.slice((page - 1) * PER, page * PER);

    const handleSave = async () => {
        if (!value.trim()) return alert("Name is required");
        setSaving(true);
        try {
            if (modal === "add") { const r = await api("POST", "/point-categories", { name: value.trim() }); setData(p => [r.data, ...p]); showToast("Category added ✅"); }
            else { const r = await api("PUT", `/point-categories/${modal._id}`, { name: value.trim() }); setData(p => p.map(x => x._id === modal._id ? r.data : x)); showToast("Category updated ✅"); }
            setModal(null);
        } catch (e) { alert(e.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async () => {
        try { await api("DELETE", `/point-categories/${delItem._id}`); setData(p => p.filter(x => x._id !== delItem._id)); showToast("Deleted"); }
        catch (e) { alert(e.message); } finally { setDelItem(null); }
    };

    return (
        <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#f8fafc", minHeight: "100vh", paddingTop: 80 }}>
            {toast && <div style={{ position: "fixed", top: 20, right: 20, background: "#22c55e", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 600, zIndex: 999 }}>{toast}</div>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Point Categories</h2>
                <button onClick={() => { setValue(""); setModal("add"); }} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, padding: "9px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>＋ Add Category</button>
            </div>

            <div style={{ padding: "20px 28px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#475569" }}>
                        Search: <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ border: "1px solid #d1d5db", borderRadius: 4, padding: "5px 10px", fontSize: 14, outline: "none" }} />
                    </div>
                </div>

                <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px #0001" }}>
                    {loading ? <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading…</div> : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                            <thead>
                                <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
                                    {["#", "Category Name", "Action"].map(h => <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 13 }}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? <tr><td colSpan={3} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No categories found</td></tr>
                                    : paginated.map((row, i) => (
                                        <tr key={row._id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                                            <td style={{ padding: "11px 14px", color: "#6b7280" }}>{(page - 1) * PER + i + 1}</td>
                                            <td style={{ padding: "11px 14px", fontWeight: 600, color: "#1e293b" }}>{row.name}</td>
                                            <td style={{ padding: "11px 14px" }}>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button onClick={() => { setValue(row.name); setModal(row); }} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 5, padding: "5px 9px", cursor: "pointer", color: "#2563eb" }}>✏️</button>
                                                    <button onClick={() => setDelItem(row)} style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 5, padding: "5px 9px", cursor: "pointer", color: "#dc2626" }}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>Showing {filtered.length === 0 ? 0 : (page - 1) * PER + 1} to {Math.min(page * PER, filtered.length)} of {filtered.length}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 14px", borderRadius: 5, border: "1px solid #d1d5db", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1, fontWeight: 600 }}>Previous</button>
                        {Array.from({ length: totalPages }, (_, k) => k + 1).map(n => <button key={n} onClick={() => setPage(n)} style={{ padding: "6px 12px", borderRadius: 5, border: "1px solid #d1d5db", background: n === page ? "#16a34a" : "#fff", color: n === page ? "#fff" : "#374151", fontWeight: 700, cursor: "pointer" }}>{n}</button>)}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "6px 14px", borderRadius: 5, border: "1px solid #d1d5db", background: "#16a34a", color: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.5 : 1, fontWeight: 600 }}>Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {modal && (
                <div style={{ position: "fixed", inset: 0, background: "#00000055", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 400, padding: 28, boxShadow: "0 8px 32px #0003" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{modal === "add" ? "Add Category" : "Edit Category"}</h3>
                            <button onClick={() => setModal(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>×</button>
                        </div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Category Name *</label>
                        <input value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. Star Performer"
                            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 6, padding: "9px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                            <button onClick={() => setModal(null)} style={{ padding: "8px 20px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving} style={{ padding: "8px 22px", borderRadius: 6, border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontWeight: 700, opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : modal === "add" ? "Add" : "Save"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {delItem && (
                <div style={{ position: "fixed", inset: 0, background: "#00000055", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 360, padding: 28, textAlign: "center", boxShadow: "0 8px 32px #0003" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
                        <h3 style={{ margin: "0 0 8px" }}>Delete Category</h3>
                        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 22 }}>Delete <strong>{delItem.name}</strong>?</p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button onClick={() => setDelItem(null)} style={{ padding: "8px 22px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                            <button onClick={handleDelete} style={{ padding: "8px 22px", borderRadius: 6, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { useState, useEffect } from "react";

const BASE = "http://localhost:5000/api";
const tok = () => localStorage.getItem("token");
const api = async (m, url, body) => {
    const r = await fetch(`${BASE}${url}`, { method: m, headers: { Authorization: `Bearer ${tok()}`, ...(body && { "Content-Type": "application/json" }) }, body: body ? JSON.stringify(body) : undefined });
    const d = await r.json(); if (!r.ok) throw new Error(d.message); return d;
};

const EMPTY = { pointShareWith: "", point: 1, pointDate: new Date().toISOString().split("T")[0] };
const PER = 10;

export default function Collaborative() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [delItem, setDelItem] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => { api("GET", "/collaborative").then(r => setData(r.data || [])).catch(() => { }).finally(() => setLoading(false)); }, []);

    const filtered = data.filter(d => d.pointShareWith?.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
    const paginated = filtered.slice((page - 1) * PER, page * PER);

    const handleSave = async () => {
        if (!form.pointShareWith.trim()) return alert("Employee name is required");
        if (!form.point || form.point < 1) return alert("Point must be at least 1");
        setSaving(true);
        try {
            if (modal === "add") { const r = await api("POST", "/collaborative", form); setData(p => [r.data, ...p]); }
            else { const r = await api("PUT", `/collaborative/${modal._id}`, form); setData(p => p.map(x => x._id === modal._id ? r.data : x)); }
            setModal(null);
        } catch (e) { alert(e.message); } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        try { await api("DELETE", `/collaborative/${delItem._id}`); setData(p => p.filter(x => x._id !== delItem._id)); }
        catch (e) { alert(e.message); } finally { setDelItem(null); }
    };

    const inp = { width: "100%", border: "1px solid #d1d5db", borderRadius: 6, padding: "9px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" };

    return (
        <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#f8fafc", minHeight: "100vh", paddingTop: 80 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Collaborative Points</h2>
                <button onClick={() => { setForm(EMPTY); setModal("add"); }} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, padding: "9px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>＋ Add Point</button>
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
                                    {["#", "Point Share With", "Point", "Date", "Action"].map(h => <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 13 }}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No records found</td></tr>
                                    : paginated.map((row, i) => (
                                        <tr key={row._id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                                            <td style={{ padding: "11px 14px", color: "#6b7280" }}>{(page - 1) * PER + i + 1}</td>
                                            <td style={{ padding: "11px 14px", fontWeight: 600 }}>{row.pointShareWith}</td>
                                            <td style={{ padding: "11px 14px" }}>
                                                <span style={{ background: "#dcfce7", color: "#16a34a", padding: "2px 10px", borderRadius: 4, fontWeight: 700, fontSize: 13 }}>{row.point}</span>
                                            </td>
                                            <td style={{ padding: "11px 14px", color: "#64748b" }}>{row.pointDate}</td>
                                            <td style={{ padding: "11px 14px" }}>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button onClick={() => { setForm({ pointShareWith: row.pointShareWith, point: row.point, pointDate: row.pointDate }); setModal(row); }} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 5, padding: "5px 9px", cursor: "pointer", color: "#2563eb" }}>✏️</button>
                                                    <button onClick={() => setDelItem(row)} style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 5, padding: "5px 9px", cursor: "pointer", color: "#dc2626" }}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>Total: {filtered.length} records</span>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 14px", borderRadius: 5, border: "1px solid #d1d5db", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1, fontWeight: 600 }}>Previous</button>
                        {Array.from({ length: totalPages }, (_, k) => k + 1).map(n => <button key={n} onClick={() => setPage(n)} style={{ padding: "6px 12px", borderRadius: 5, border: "1px solid #d1d5db", background: n === page ? "#16a34a" : "#fff", color: n === page ? "#fff" : "#374151", fontWeight: 700, cursor: "pointer" }}>{n}</button>)}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "6px 14px", borderRadius: 5, border: "1px solid #d1d5db", background: "#16a34a", color: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.5 : 1, fontWeight: 600 }}>Next</button>
                    </div>
                </div>
            </div>

            {modal && (
                <div style={{ position: "fixed", inset: 0, background: "#00000055", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 440, padding: 28, boxShadow: "0 8px 32px #0003" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{modal === "add" ? "Add Collaborative Point" : "Edit Collaborative Point"}</h3>
                            <button onClick={() => setModal(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>×</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Share With (Employee Name) *</label>
                                <input value={form.pointShareWith} onChange={e => setForm({ ...form, pointShareWith: e.target.value })} placeholder="Employee name" style={inp} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Points *</label>
                                <input type="number" min="1" value={form.point} onChange={e => setForm({ ...form, point: Number(e.target.value) })} style={inp} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Date *</label>
                                <input type="date" value={form.pointDate} onChange={e => setForm({ ...form, pointDate: e.target.value })} style={inp} />
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                            <button onClick={() => setModal(null)} style={{ padding: "8px 20px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving} style={{ padding: "8px 22px", borderRadius: 6, border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontWeight: 700, opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : modal === "add" ? "Add" : "Save"}</button>
                        </div>
                    </div>
                </div>
            )}

            {delItem && (
                <div style={{ position: "fixed", inset: 0, background: "#00000055", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 360, padding: 28, textAlign: "center", boxShadow: "0 8px 32px #0003" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
                        <h3 style={{ margin: "0 0 8px" }}>Delete Point Record?</h3>
                        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 22 }}>Point for <strong>{delItem.pointShareWith}</strong> will be removed.</p>
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
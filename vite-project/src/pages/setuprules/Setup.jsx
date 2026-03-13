import { useState, useEffect, useMemo } from "react";

const BASE = "http://localhost:5000/api";
const tok = () => localStorage.getItem("token");
const req = async (m, url, body) => {
    const r = await fetch(`${BASE}${url}`, {
        method: m,
        headers: { Authorization: `Bearer ${tok()}`, ...(body && { "Content-Type": "application/json" }) },
        body: body ? JSON.stringify(body) : undefined,
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Error");
    return d;
};

const EMPTY = { name: "", type: "Deduction", amount: "", startTime: "", endTime: "", onGross: false, onBasic: false, status: "Active" };
const PAGE_SIZE = 10;

const Badge = ({ val }) => (
    <span style={{
        display: "inline-block", padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700,
        background: val ? "#16a34a" : "#dc2626", color: "#fff"
    }}>{val ? "Yes" : "No"}</span>
);
const StatusBadge = ({ s }) => (
    <span style={{
        display: "inline-block", padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700,
        background: s === "Active" ? "#16a34a" : "#dc2626", color: "#fff"
    }}>{s}</span>
);

export default function SetupRules() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [delItem, setDelItem] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await req("GET", "/setup-rules"); setData(r.data || []); }
        catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    const openAdd = () => { setForm(EMPTY); setModal("add"); };
    const openEdit = (row) => { setForm({ ...row }); setModal(row._id); };

    const handleSave = async () => {
        if (!form.name.trim()) return alert("Name is required");
        setSaving(true);
        try {
            if (modal === "add") {
                const r = await req("POST", "/setup-rules", form);
                setData(p => [r.data, ...p]);
            } else {
                const r = await req("PUT", `/setup-rules/${modal}`, form);
                setData(p => p.map(x => x._id === modal ? r.data : x));
            }
            setModal(null);
        } catch (e) { alert(e.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async () => {
        try { await req("DELETE", `/setup-rules/${delItem._id}`); setData(p => p.filter(x => x._id !== delItem._id)); }
        catch (e) { alert(e.message); }
        finally { setDelItem(null); }
    };

    const filtered = useMemo(() => data.filter(r => r.name?.toLowerCase().includes(search.toLowerCase()) || r.type?.toLowerCase().includes(search.toLowerCase())), [data, search]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const inp = { border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 10px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };

    return (
        <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#f8fafc", minHeight: "100vh", paddingTop: 80 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Setup Rules</h2>
                <button onClick={openAdd} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, padding: "9px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    ＋ Add Setup Rule
                </button>
            </div>

            <div style={{ padding: "20px 28px" }}>
                {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 16px", borderRadius: 8, marginBottom: 12 }}>{error}</div>}

                {/* Search */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#475569" }}>
                        Search:
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            style={{ border: "1px solid #d1d5db", borderRadius: 4, padding: "5px 10px", fontSize: 14, outline: "none" }} />
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px #0001" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading…</div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 860 }}>
                            <thead>
                                <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
                                    {["#", "Name", "Type", "Amount", "Start Time", "End Time", "On Gross", "On Basic", "Status", "Action"].map(h => (
                                        <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "#374151", whiteSpace: "nowrap", fontSize: 13 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={10} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No records found</td></tr>
                                ) : paginated.map((row, i) => (
                                    <tr key={row._id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                                        <td style={{ padding: "11px 14px", color: "#6b7280" }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                                        <td style={{ padding: "11px 14px", fontWeight: 600 }}>{row.name}</td>
                                        <td style={{ padding: "11px 14px" }}>{row.type}</td>
                                        <td style={{ padding: "11px 14px" }}>{row.amount || "—"}</td>
                                        <td style={{ padding: "11px 14px" }}>{row.startTime || "—"}</td>
                                        <td style={{ padding: "11px 14px" }}>{row.endTime || "—"}</td>
                                        <td style={{ padding: "11px 14px" }}><Badge val={row.onGross} /></td>
                                        <td style={{ padding: "11px 14px" }}><Badge val={row.onBasic} /></td>
                                        <td style={{ padding: "11px 14px" }}><StatusBadge s={row.status} /></td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button onClick={() => openEdit(row)} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 5, padding: "5px 9px", cursor: "pointer", color: "#2563eb" }}>✏️</button>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 14px", borderRadius: 5, border: "1px solid #d1d5db", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1, fontWeight: 600 }}>Previous</button>
                        {Array.from({ length: totalPages }, (_, k) => k + 1).map(n => (
                            <button key={n} onClick={() => setPage(n)} style={{ padding: "6px 12px", borderRadius: 5, border: "1px solid #d1d5db", background: n === page ? "#16a34a" : "#fff", color: n === page ? "#fff" : "#374151", fontWeight: 700, cursor: "pointer" }}>{n}</button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "6px 14px", borderRadius: 5, border: "1px solid #d1d5db", background: "#16a34a", color: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.5 : 1, fontWeight: 600 }}>Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {modal && (
                <div style={{ position: "fixed", inset: 0, background: "#00000055", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 520, boxShadow: "0 8px 32px #0003", padding: "28px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{modal === "add" ? "Add Setup Rule" : "Edit Setup Rule"}</h3>
                            <button onClick={() => setModal(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#64748b" }}>×</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
                            <div style={{ gridColumn: "1/-1" }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Name *</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} placeholder="Rule name" />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Type *</label>
                                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
                                    {["Deduction", "Time", "Basic", "Allowance"].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Amount</label>
                                <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inp} placeholder="e.g. 10(%) or 3000" />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Start Time</label>
                                <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} style={inp} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>End Time</label>
                                <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} style={inp} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>
                                    <option>Active</option><option>Inactive</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                <input type="checkbox" id="og" checked={form.onGross} onChange={e => setForm({ ...form, onGross: e.target.checked })} style={{ width: 16, height: 16, cursor: "pointer" }} />
                                <label htmlFor="og" style={{ fontSize: 14, cursor: "pointer" }}>On Gross</label>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                <input type="checkbox" id="ob" checked={form.onBasic} onChange={e => setForm({ ...form, onBasic: e.target.checked })} style={{ width: 16, height: 16, cursor: "pointer" }} />
                                <label htmlFor="ob" style={{ fontSize: 14, cursor: "pointer" }}>On Basic</label>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                            <button onClick={() => setModal(null)} style={{ padding: "8px 20px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving} style={{ padding: "8px 22px", borderRadius: 6, border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
                                {saving ? "Saving…" : modal === "add" ? "Add Rule" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {delItem && (
                <div style={{ position: "fixed", inset: 0, background: "#00000055", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 380, padding: 28, textAlign: "center", boxShadow: "0 8px 32px #0003" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
                        <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>Delete Rule</h3>
                        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 22 }}>Delete <strong>{delItem.name}</strong>? This cannot be undone.</p>
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
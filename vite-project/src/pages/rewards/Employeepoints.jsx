import { useState, useEffect, useMemo } from "react";

const BASE = "http://localhost:5000/api";
const tok = () => localStorage.getItem("token");
const apiGet = async (url) => {
    const r = await fetch(`${BASE}${url}`, { headers: { Authorization: `Bearer ${tok()}` } });
    const d = await r.json(); return d;
};

const PER = 10;

export default function EmployeePoints() {
    const [colPoints, setColPoints] = useState([]);
    const [mgmtPoints, setMgmtPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        Promise.allSettled([
            apiGet("/collaborative"),
            apiGet("/management-points"),
        ]).then(([col, mgmt]) => {
            setColPoints(col.status === "fulfilled" ? col.value.data || [] : []);
            setMgmtPoints(mgmt.status === "fulfilled" ? mgmt.value.data || [] : []);
        }).finally(() => setLoading(false));
    }, []);

    // Aggregate points per employee
    const aggregated = useMemo(() => {
        const map = {};
        colPoints.forEach(p => {
            const n = p.pointShareWith;
            if (!map[n]) map[n] = { name: n, collaborative: 0, management: 0 };
            map[n].collaborative += p.point || 0;
        });
        mgmtPoints.forEach(p => {
            const n = p.employeeName;
            if (!map[n]) map[n] = { name: n, collaborative: 0, management: 0 };
            map[n].management += p.point || 0;
        });
        return Object.values(map).map(e => ({ ...e, total: e.collaborative + e.management })).sort((a, b) => b.total - a.total);
    }, [colPoints, mgmtPoints]);

    const filtered = aggregated.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
    const paginated = filtered.slice((page - 1) * PER, page * PER);

    return (
        <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#f8fafc", minHeight: "100vh", paddingTop: 80 }}>
            <div style={{ padding: "18px 28px", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Employee Points Summary</h2>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Aggregated from Collaborative + Management points</p>
            </div>
            <div style={{ padding: "20px 28px" }}>
                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 24 }}>
                    {[
                        { label: "Total Employees", value: aggregated.length, color: "#3b82f6", bg: "#eff6ff" },
                        { label: "Total Points", value: aggregated.reduce((s, e) => s + e.total, 0), color: "#16a34a", bg: "#f0fdf4" },
                        { label: "Collaborative", value: colPoints.reduce((s, p) => s + p.point, 0), color: "#8b5cf6", bg: "#f5f3ff" },
                        { label: "Management", value: mgmtPoints.reduce((s, p) => s + p.point, 0), color: "#f59e0b", bg: "#fffbeb" },
                    ].map(({ label, value, color, bg }) => (
                        <div key={label} style={{ background: bg, borderRadius: 10, padding: "16px 20px", border: `1px solid ${color}22` }}>
                            <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>

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
                                    {["Rank", "Employee", "Collaborative", "Management", "Total Points"].map(h => <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 13 }}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No data yet. Add collaborative or management points first.</td></tr>
                                    : paginated.map((row, i) => {
                                        const rank = (page - 1) * PER + i + 1;
                                        return (
                                            <tr key={row.name} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                                                <td style={{ padding: "11px 14px" }}>
                                                    <span style={{ background: rank <= 3 ? "#fef3c7" : "#f1f5f9", color: rank <= 3 ? "#d97706" : "#64748b", width: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>
                                                        {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : rank}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "11px 14px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#4f46e5", fontSize: 13 }}>
                                                            {row.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{row.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "11px 14px" }}>
                                                    <span style={{ background: "#f5f3ff", color: "#7c3aed", padding: "2px 10px", borderRadius: 4, fontWeight: 700, fontSize: 13 }}>{row.collaborative || 0}</span>
                                                </td>
                                                <td style={{ padding: "11px 14px" }}>
                                                    <span style={{ background: "#fffbeb", color: "#d97706", padding: "2px 10px", borderRadius: 4, fontWeight: 700, fontSize: 13 }}>{row.management || 0}</span>
                                                </td>
                                                <td style={{ padding: "11px 14px" }}>
                                                    <span style={{ background: "#dcfce7", color: "#16a34a", padding: "3px 14px", borderRadius: 6, fontWeight: 800, fontSize: 15 }}>{row.total}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>Showing {filtered.length === 0 ? 0 : (page - 1) * PER + 1} to {Math.min(page * PER, filtered.length)} of {filtered.length}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 14px", borderRadius: 5, border: "1px solid #d1d5db", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1, fontWeight: 600 }}>Previous</button>
                        {Array.from({ length: totalPages }, (_, k) => k + 1).map(n => <button key={n} onClick={() => setPage(n)} style={{ padding: "6px 12px", borderRadius: 5, border: "1px solid #d1d5db", background: n === page ? "#16a34a" : "#fff", color: n === page ? "#fff" : "#374151", fontWeight: 700, cursor: "pointer" }}>{n}</button>)}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "6px 14px", borderRadius: 5, border: "1px solid #d1d5db", background: "#16a34a", color: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.5 : 1, fontWeight: 600 }}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
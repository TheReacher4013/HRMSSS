import { useState, useEffect, useMemo } from "react";

const BASE = "http://localhost:5000/api";
const tok = () => localStorage.getItem("token");
const apiGet = async (url) => {
    const r = await fetch(`${BASE}${url}`, { headers: { Authorization: `Bearer ${tok()}` } });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message);
    return d;
};

const PER_OPTIONS = [10, 25, 50, 100];

function SortIcon() {
    return (
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ marginLeft: 4, verticalAlign: "middle", opacity: 0.4 }}>
            <path d="M5 0L9.33 5H0.67L5 0Z" fill="#555" />
            <path d="M5 14L0.67 9H9.33L5 14Z" fill="#555" />
        </svg>
    );
}

export default function AttendancePoints() {
    const [records, setRecords] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState("date");
    const [sortDir, setSortDir] = useState("desc");

    useEffect(() => {
        Promise.allSettled([
            apiGet("/attendance"),
            apiGet("/point-settings"),
        ]).then(([att, ps]) => {
            if (att.status === "fulfilled") {
                const raw = att.value.data || att.value.attendance || att.value || [];
                setRecords(Array.isArray(raw) ? raw : []);
            } else {
                setError("Could not load attendance data");
            }
            if (ps.status === "fulfilled") setSettings(ps.value.data || null);
        }).finally(() => setLoading(false));
    }, []);

    // Calculate points per record based on punchIn time vs settings startTime
    const processedData = useMemo(() => {
        const startLimit = settings?.startTime || "09:00";
        const ptPerDay = Number(settings?.attendancePoint) || 5;

        return records.map((r, idx) => {
            // Support different field name patterns from attendance backend
            const employeeName = r.employeeName || r.employee || r.name || r.userName || "Unknown";
            const punchIn = r.punchIn || r.inTime || r.checkIn || "";
            const date = r.date ? r.date.split("T")[0] : (r.createdAt ? r.createdAt.split("T")[0] : "");

            // Extract HH:MM from punchIn (could be full ISO or just time)
            let inTime = "";
            if (punchIn) {
                if (punchIn.includes("T")) {
                    inTime = punchIn.split("T")[1]?.substring(0, 5) || "";
                } else {
                    inTime = punchIn.substring(0, 5);
                }
            }

            // Award points only if punched in on or before startLimit
            const onTime = inTime && inTime <= startLimit;
            const points = onTime ? ptPerDay : 0;

            return { _id: r._id || idx, employeeName, inTime: inTime || "—", points, date, onTime };
        });
    }, [records, settings]);

    // Filter
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return processedData.filter(r =>
            r.employeeName.toLowerCase().includes(q) ||
            r.inTime.includes(q) ||
            String(r.points).includes(q) ||
            r.date.includes(q)
        );
    }, [processedData, search]);

    // Sort
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
            if (av < bv) return sortDir === "asc" ? -1 : 1;
            if (av > bv) return sortDir === "asc" ? 1 : -1;
            return 0;
        });
    }, [filtered, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
    const safePage = Math.min(page, totalPages);
    const paginated = sorted.slice((safePage - 1) * perPage, safePage * perPage);

    const handleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
        setPage(1);
    };

    // Smart pagination numbers
    const getPageNums = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (safePage <= 3) return [1, 2, 3, 4, 5, "...", totalPages];
        if (safePage >= totalPages - 2) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages];
    };

    const totalPointsAwarded = processedData.reduce((s, r) => s + r.points, 0);
    const onTimeCount = processedData.filter(r => r.onTime).length;
    const showFrom = sorted.length === 0 ? 0 : (safePage - 1) * perPage + 1;
    const showTo = Math.min(safePage * perPage, sorted.length);

    return (
        <>
            <style>{`
        * { box-sizing: border-box; }
        .ap-wrap { background: #f0f2f5; min-height: 100vh; padding: 28px; font-family: 'Segoe UI', sans-serif; padding-top: 80px; }
        .ap-card { background: #fff; border-radius: 12px; padding: 28px 32px; box-shadow: 0 1px 6px rgba(0,0,0,0.08); }
        .ap-title { font-size: 20px; font-weight: 700; color: #111; margin: 0 0 6px; }
        .ap-subtitle { font-size: 13px; color: #64748b; margin: 0 0 22px; }
        .ap-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-bottom: 24px; }
        .ap-stat { border-radius: 10px; padding: 14px 18px; }
        .ap-stat-val { font-size: 24px; font-weight: 800; }
        .ap-stat-lbl { font-size: 12px; font-weight: 600; color: #64748b; margin-top: 2px; }
        .ap-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .ap-show { font-size: 13px; color: #555; display: flex; align-items: center; gap: 6px; }
        .ap-show select { border: 1px solid #d1d5db; border-radius: 5px; padding: 4px 8px; font-size: 13px; cursor: pointer; outline: none; }
        .ap-search { font-size: 13px; color: #555; display: flex; align-items: center; gap: 8px; }
        .ap-search input { border: 1px solid #d1d5db; border-radius: 5px; padding: 6px 10px; font-size: 13px; outline: none; width: 200px; }
        .ap-search input:focus { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,0.15); }
        .ap-table-wrap { overflow-x: auto; }
        .ap-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .ap-table thead tr { border-top: 1px solid #e5e7eb; border-bottom: 2px solid #e5e7eb; background: #f9fafb; }
        .ap-table th { padding: 12px 16px; text-align: left; font-weight: 700; color: #374151; white-space: nowrap; cursor: pointer; user-select: none; }
        .ap-table th:hover { background: #f0fdf4; }
        .ap-table tbody tr { border-bottom: 1px solid #f0f0f0; transition: background 0.1s; }
        .ap-table tbody tr:hover td { background: #f0fdf4 !important; }
        .ap-table tbody tr:nth-child(even) td { background: #f9fafb; }
        .ap-table td { padding: 11px 16px; color: #222; }
        .ap-cards { display: none; flex-direction: column; gap: 12px; }
        .ap-row-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .ap-row-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .ap-row-card-sl { font-size: 11px; font-weight: 700; color: #fff; background: #16a34a; border-radius: 20px; padding: 3px 10px; }
        .ap-row-card-date { font-size: 12px; color: #6b7280; font-weight: 500; }
        .ap-row-card-name { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 10px; }
        .ap-row-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .ap-row-card-item { background: #f9fafb; border-radius: 7px; padding: 8px 12px; }
        .ap-row-card-label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
        .ap-row-card-val { font-size: 14px; font-weight: 600; color: #222; }
        .ap-row-card-val.green { color: #16a34a; }
        .ap-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; flex-wrap: wrap; gap: 12px; }
        .ap-info { font-size: 13px; color: #555; }
        .ap-pages { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
        .ap-pages button { padding: 7px 12px; border-radius: 6px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; font-size: 13px; font-weight: 500; color: #333; min-width: 36px; }
        .ap-pages button:hover:not(:disabled):not(.active) { background: #f3f4f6; }
        .ap-pages button.active { background: #16a34a; color: #fff; font-weight: 700; border-color: #16a34a; }
        .ap-pages button:disabled { opacity: 0.4; cursor: not-allowed; }
        .ap-pages button.ellipsis { cursor: default; background: transparent; border: none; color: #9ca3af; }
        .ap-pages .prev-next { font-weight: 600; padding: 7px 14px; }
        @media (max-width: 700px) {
          .ap-wrap { padding: 14px; padding-top: 80px; }
          .ap-card { padding: 18px 16px; }
          .ap-title { font-size: 17px; }
          .ap-table-wrap { display: none; }
          .ap-cards { display: flex; }
          .ap-search input { width: 130px; }
          .ap-footer { flex-direction: column; align-items: flex-start; }
          .ap-pages { justify-content: center; width: 100%; }
        }
      `}</style>

            <div className="ap-wrap">
                <div className="ap-card">
                    <h2 className="ap-title">Attendance Points</h2>
                    <p className="ap-subtitle">
                        Points awarded when employee punches in on or before{" "}
                        <strong>{settings?.startTime || "09:00"}</strong> — {settings?.attendancePoint || 5} pts/day
                    </p>

                    {/* Stats */}
                    {!loading && (
                        <div className="ap-stats">
                            {[
                                { label: "Total Records", value: processedData.length, color: "#3b82f6", bg: "#eff6ff" },
                                { label: "On-Time Punches", value: onTimeCount, color: "#16a34a", bg: "#f0fdf4" },
                                { label: "Points Awarded", value: totalPointsAwarded, color: "#f59e0b", bg: "#fffbeb" },
                                { label: "Zero Points", value: processedData.length - onTimeCount, color: "#ef4444", bg: "#fef2f2" },
                            ].map(({ label, value, color, bg }) => (
                                <div key={label} className="ap-stat" style={{ background: bg, border: `1px solid ${color}22` }}>
                                    <div className="ap-stat-val" style={{ color }}>{value.toLocaleString()}</div>
                                    <div className="ap-stat-lbl">{label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af", fontSize: 15 }}>Loading attendance data…</div>
                    ) : (
                        <>
                            {/* Controls */}
                            <div className="ap-controls">
                                <div className="ap-show">
                                    Show&nbsp;
                                    <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }}>
                                        {PER_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    &nbsp;entries
                                </div>
                                <div className="ap-search">
                                    Search:
                                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search…" />
                                </div>
                            </div>

                            {/* Desktop Table */}
                            <div className="ap-table-wrap">
                                <table className="ap-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: 60, textAlign: "center" }}>Sl <SortIcon /></th>
                                            {[
                                                { key: "employeeName", label: "Employee" },
                                                { key: "inTime", label: "In Time" },
                                                { key: "points", label: "Points" },
                                                { key: "date", label: "Date" },
                                            ].map(({ key, label }) => (
                                                <th key={key} onClick={() => handleSort(key)}>
                                                    {label} <SortIcon />
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.length === 0 ? (
                                            <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No records found</td></tr>
                                        ) : paginated.map((row, idx) => (
                                            <tr key={row._id}>
                                                <td style={{ textAlign: "center", color: "#6b7280" }}>{showFrom + idx}</td>
                                                <td style={{ fontWeight: 600 }}>{row.employeeName}</td>
                                                <td style={{ color: "#64748b" }}>{row.inTime}</td>
                                                <td>
                                                    <span style={{
                                                        background: row.points > 0 ? "#dcfce7" : "#f1f5f9",
                                                        color: row.points > 0 ? "#16a34a" : "#94a3b8",
                                                        padding: "2px 10px", borderRadius: 4, fontWeight: 700, fontSize: 13
                                                    }}>
                                                        {row.points > 0 ? `⭐ ${row.points}` : row.points}
                                                    </span>
                                                </td>
                                                <td style={{ color: "#64748b" }}>{row.date || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="ap-cards">
                                {paginated.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No records found</div>
                                ) : paginated.map((row, idx) => (
                                    <div className="ap-row-card" key={row._id}>
                                        <div className="ap-row-card-header">
                                            <span className="ap-row-card-sl">#{showFrom + idx}</span>
                                            <span className="ap-row-card-date">📅 {row.date || "—"}</span>
                                        </div>
                                        <div className="ap-row-card-name">{row.employeeName}</div>
                                        <div className="ap-row-card-grid">
                                            <div className="ap-row-card-item">
                                                <div className="ap-row-card-label">In Time</div>
                                                <div className="ap-row-card-val">🕐 {row.inTime}</div>
                                            </div>
                                            <div className="ap-row-card-item">
                                                <div className="ap-row-card-label">Points</div>
                                                <div className={`ap-row-card-val ${row.points > 0 ? "green" : ""}`}>
                                                    {row.points > 0 ? `⭐ ${row.points}` : row.points}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer / Pagination */}
                            <div className="ap-footer">
                                <span className="ap-info">
                                    Showing {showFrom} to {showTo} of {sorted.length.toLocaleString()} entries
                                </span>
                                <div className="ap-pages">
                                    <button className="prev-next" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
                                    {getPageNums().map((n, i) =>
                                        n === "..."
                                            ? <button key={`e${i}`} className="ellipsis" disabled>…</button>
                                            : <button key={n} className={n === safePage ? "active" : ""} onClick={() => setPage(n)}>{n}</button>
                                    )}
                                    <button className="prev-next" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
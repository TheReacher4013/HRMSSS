import { useState, useEffect } from "react";

const BASE = "http://localhost:5000/api";
const tok = () => localStorage.getItem("token");

export default function PointSettings() {
    const [form, setForm] = useState({ generalPoint: "40", attendancePoint: "5", collaborativeStart: "", collaborativeEnd: "", startTime: "09:00", endTime: "17:00" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetch(`${BASE}/point-settings`, { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json()).then(d => { if (d.data) setForm({ generalPoint: String(d.data.generalPoint || 40), attendancePoint: String(d.data.attendancePoint || 5), collaborativeStart: d.data.collaborativeStart || "", collaborativeEnd: d.data.collaborativeEnd || "", startTime: d.data.startTime || "09:00", endTime: d.data.endTime || "17:00" }); })
            .catch(() => { }).finally(() => setLoading(false));
    }, []);

    const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

    const validate = () => {
        const e = {};
        if (!form.generalPoint) e.generalPoint = "Required";
        if (!form.attendancePoint) e.attendancePoint = "Required";
        if (!form.collaborativeStart) e.collaborativeStart = "Required";
        if (!form.collaborativeEnd) e.collaborativeEnd = "Required";
        if (!form.startTime) e.startTime = "Required";
        if (!form.endTime) e.endTime = "Required";
        return e;
    };

    const handleSave = async () => {
        const e = validate(); if (Object.keys(e).length) { setErrors(e); return; }
        setSaving(true);
        try {
            const r = await fetch(`${BASE}/point-settings`, { method: "POST", headers: { Authorization: `Bearer ${tok()}`, "Content-Type": "application/json" }, body: JSON.stringify(form) });
            const d = await r.json();
            if (!r.ok) throw new Error(d.message);
            showToast("Settings saved successfully! ✓");
        } catch (err) { showToast(err.message || "Failed to save", false); }
        finally { setSaving(false); }
    };

    const handleReset = () => { setForm({ generalPoint: "40", attendancePoint: "5", collaborativeStart: "", collaborativeEnd: "", startTime: "09:00", endTime: "17:00" }); setErrors({}); showToast("Reset to defaults", true); };

    const fields = [
        { label: "General Point", name: "generalPoint", type: "number" },
        { label: "Attendance Point", name: "attendancePoint", type: "number" },
        { label: "Collaborative Start", name: "collaborativeStart", type: "date" },
        { label: "Collaborative End", name: "collaborativeEnd", type: "date" },
        { label: "Start Time", name: "startTime", type: "time" },
        { label: "End Time", name: "endTime", type: "time" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "#f4f6f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'Segoe UI',sans-serif", paddingTop: 80 }}>
            {toast && (
                <div style={{ position: "fixed", top: 24, right: 24, zIndex: 1000, background: toast.ok ? "#22c55e" : "#ef4444", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}>
                    {toast.msg}
                </div>
            )}
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 20px rgba(0,0,0,.08)", width: "100%", maxWidth: 680, padding: "clamp(24px,5vw,40px)" }}>
                <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1a1a2e", marginBottom: 28, paddingBottom: 16, borderBottom: "2px solid #f0f0f0", margin: "0 0 28px" }}>Point Settings</h2>
                {loading ? <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading…</div> : (
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
                            {fields.map(({ label, name, type }) => (
                                <div key={name}>
                                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label} <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input type={type} name={name} value={form[name]} onChange={e => { setForm({ ...form, [name]: e.target.value }); setErrors({ ...errors, [name]: "" }); }}
                                        style={{ padding: "10px 14px", border: `1.5px solid ${errors[name] ? "#ef4444" : "#e5e7eb"}`, borderRadius: 8, fontSize: 15, color: "#1f2937", background: "#fafafa", outline: "none", width: "100%", boxSizing: "border-box" }} />
                                    {errors[name] && <span style={{ fontSize: 12, color: "#ef4444" }}>{errors[name]}</span>}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 32, paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
                            <button onClick={handleReset} style={{ padding: "10px 28px", borderRadius: 7, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Reset</button>
                            <button onClick={handleSave} disabled={saving} style={{ padding: "10px 28px", borderRadius: 7, border: "none", background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : "Save"}</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
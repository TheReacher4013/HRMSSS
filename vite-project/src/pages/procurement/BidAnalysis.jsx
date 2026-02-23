// import DataTable from "../../component/DataTable";

// export default function BidAnalysis() {
//     return (
//         <DataTable
//             title="Bid analysis"
//             addLabel="Add bid analysis"
//             columns={[
//                 { key: "bid", label: "Bid no" },
//                 { key: "sba", label: "Sba no" },
//                 { key: "loc", label: "Location" },
//                 { key: "date", label: "Date" },
//             ]}
//             data={[
//                 { bid: "BID-00015", sba: "66", loc: "mnn", date: "2025-09-26" },
//                 { bid: "BID-00014", sba: "Att", loc: "Lkjjj", date: "2025-09-17" },
//             ]}
//         />
//     );
// }




import { useState, useEffect, useMemo } from "react";
import DataTable from "../../component/DataTable";
import { bidService } from "../../api/bidService";
import { X, Loader2, Plus, Calendar, MapPin, Hash } from "lucide-react";

export default function BidAnalysis() {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ bid: "", sba: "", loc: "", date: "" });
    const [isSaving, setIsSaving] = useState(false);

    // --- 1. Fetch Data From Backend ---
    const fetchBids = async () => {
        setLoading(true);
        try {
            const res = await bidService.list();
            setBids(res.data);
        } catch (err) {
            console.error("Error fetching bids:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, []);

    // --- 2. Save New Bid ---
    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.bid || !form.sba) return alert("Please fill required fields");

        setIsSaving(true);
        try {
            await bidService.create(form);
            setShowModal(false);
            setForm({ bid: "", sba: "", loc: "", date: "" });
            fetchBids(); // List refresh karein
        } catch (err) {
            alert("Error saving bid analysis");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header Section handles the "Add" trigger via DataTable */}
                <DataTable
                    title="Bid Analysis"
                    addLabel="Add Bid Analysis"
                    onAdd={() => setShowModal(true)}
                    columns={[
                        { key: "bid", label: "Bid No" },
                        { key: "sba", label: "SBA No" },
                        { key: "loc", label: "Location" },
                        { key: "date", label: "Date" },
                    ]}
                    data={bids}
                    isLoading={loading}
                />

                {/* --- ADD MODAL --- */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-800">New Bid Entry</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bid Number</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:ring-2 ring-emerald-100 outline-none transition-all"
                                            placeholder="BID-000XXX"
                                            value={form.bid}
                                            onChange={e => setForm({ ...form, bid: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">SBA No</label>
                                        <input
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 ring-emerald-100 outline-none transition-all"
                                            placeholder="SBA-XX"
                                            value={form.sba}
                                            onChange={e => setForm({ ...form, sba: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="date"
                                                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:ring-2 ring-emerald-100 outline-none transition-all"
                                                value={form.date}
                                                onChange={e => setForm({ ...form, date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:ring-2 ring-emerald-100 outline-none transition-all"
                                            placeholder="Enter site location"
                                            value={form.loc}
                                            onChange={e => setForm({ ...form, loc: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSaving}
                                    type="submit"
                                    className="w-full bg-[#0a4d44] hover:bg-slate-800 text-white p-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10 transition-all mt-4 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                    {isSaving ? "Saving..." : "Create Bid Analysis"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

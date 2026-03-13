import { useState, useEffect } from "react";
import {
    Plus,
    X,
    Briefcase,
    Loader2,
    IndianRupee
} from "lucide-react";
import { projectAPI } from "../../services/api";

const STATUS = [
    "Not Started",
    "In Progress",
    "Completed",
    "On Hold",
    "Cancelled"
];

const PRIORITY = ["Low", "Medium", "High"];

const EMPTY = {
    title: "",
    clientName: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    priority: "Medium",
    status: "Not Started",
    progress: 0
};

export default function Projects() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await projectAPI.getAll();
            setRows(res.data || []);
        } catch {
            alert("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    const openAdd = () => {
        setForm(EMPTY);
        setModal(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) {
            alert("Project title required");
            return;
        }

        setSaving(true);

        try {
            const res = await projectAPI.create(form);
            setRows((p) => [res.data, ...p]);
            setModal(false);
        } catch {
            alert("Save failed");
        }

        setSaving(false);
    };

    return (
        <div className="bg-slate-50 min-h-screen p-8">

            {/* Header */}

            <div className="flex justify-between mb-6">

                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase size={22} />
                    Projects
                </h1>

                <button
                    onClick={openAdd}
                    className="bg-[#0a4d44] text-white px-5 py-3 rounded-xl flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Project
                </button>

            </div>

            {/* Table */}

            {loading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <table className="w-full bg-white rounded-xl overflow-hidden">

                    <thead className="bg-slate-100 text-sm">

                        <tr>
                            <th className="p-3 text-left">Title</th>
                            <th>Client</th>
                            <th>Budget</th>
                            <th>Status</th>
                            <th>Progress</th>
                        </tr>

                    </thead>

                    <tbody>

                        {rows.map((r) => (
                            <tr key={r._id} className="border-t">

                                <td className="p-3 font-semibold">
                                    {r.title}
                                </td>

                                <td>{r.clientName || "—"}</td>

                                <td className="flex items-center gap-1">
                                    <IndianRupee size={12} />
                                    {r.budget || "—"}
                                </td>

                                <td>{r.status}</td>

                                <td>{r.progress}%</td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            )}

            {/* Modal */}

            {modal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-[600px] rounded-xl p-6">

                        <div className="flex justify-between mb-4">

                            <h2 className="font-bold text-lg">
                                Add Project
                            </h2>

                            <button onClick={() => setModal(false)}>
                                <X size={18} />
                            </button>

                        </div>

                        {/* Form */}

                        <div className="grid grid-cols-2 gap-4">

                            <input
                                placeholder="Project Title"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                placeholder="Client Name"
                                value={form.clientName}
                                onChange={(e) =>
                                    setForm({ ...form, clientName: e.target.value })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) =>
                                    setForm({ ...form, startDate: e.target.value })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="date"
                                value={form.endDate}
                                onChange={(e) =>
                                    setForm({ ...form, endDate: e.target.value })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="number"
                                placeholder="Budget"
                                value={form.budget}
                                onChange={(e) =>
                                    setForm({ ...form, budget: e.target.value })
                                }
                                className="border p-2 rounded"
                            />

                            <select
                                value={form.priority}
                                onChange={(e) =>
                                    setForm({ ...form, priority: e.target.value })
                                }
                                className="border p-2 rounded"
                            >
                                {PRIORITY.map((p) => (
                                    <option key={p}>{p}</option>
                                ))}
                            </select>

                            <select
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value })
                                }
                                className="border p-2 rounded"
                            >
                                {STATUS.map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Progress %"
                                value={form.progress}
                                onChange={(e) =>
                                    setForm({ ...form, progress: e.target.value })
                                }
                                className="border p-2 rounded"
                            />

                            <textarea
                                placeholder="Project Description"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                className="border p-2 rounded col-span-2"
                            />

                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-green-600 text-white w-full mt-6 py-3 rounded"
                        >
                            {saving ? "Saving..." : "Save Project"}
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}




// `import { useState, useEffect } from "react";
// import {
//     Plus,
//     X,
//     Briefcase,
//     Loader2,
//     IndianRupee
// } from "lucide-react";
// import { projectAPI } from "../../services/api";

// const STATUS = [
//     "Not Started",
//     "In Progress",
//     "Completed",
//     "On Hold",
//     "Cancelled"
// ];

// const PRIORITY = ["Low", "Medium", "High"];

// const EMPTY = {
//     title: "",
//     clientName: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     budget: "",
//     priority: "Medium",
//     status: "Not Started",
//     progress: 0
// };

// export default function Projects() {

//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modal, setModal] = useState(false);
//     const [form, setForm] = useState(EMPTY);
//     const [saving, setSaving] = useState(false);

//     useEffect(() => {
//         loadProjects();
//     }, []);

//     const loadProjects = async () => {
//         try {
//             const res = await projectAPI.getAll();
//             setRows(res.data || []);
//         } catch {
//             alert("Failed to load projects");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const openAdd = () => {
//         setForm(EMPTY);
//         setModal(true);
//     };

//     const handleSave = async () => {

//         if (!form.title.trim()) {
//             alert("Project title required");
//             return;
//         }

//         setSaving(true);

//         try {

//             const res = await projectAPI.create(form);
//             setRows((p) => [res.data, ...p]);
//             setModal(false);

//         } catch {

//             alert("Save failed");

//         }

//         setSaving(false);
//     };

//     return (

//         <div className="bg-slate-50 min-h-screen p-4 md:p-8">

//             {/* Header */}

//             <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

//                 <h1 className="text-2xl font-bold flex items-center gap-2">
//                     <Briefcase size={22} />
//                     Projects
//                 </h1>

//                 <button
//                     onClick={openAdd}
//                     className="bg-[#0a4d44] text-white px-5 py-3 rounded-xl flex items-center gap-2 justify-center"
//                 >
//                     <Plus size={18} />
//                     Add Project
//                 </button>

//             </div>

//             {/* Loading */}

//             {loading ? (
//                 <div className="flex justify-center">
//                     <Loader2 className="animate-spin" />
//                 </div>
//             ) : (
//                 <>

//                     {/* 📱 MOBILE CARDS */}

//                     <div className="grid gap-4 md:hidden">

//                         {rows.map((r) => (

//                             <div
//                                 key={r._id}
//                                 className="bg-white shadow rounded-xl p-4 border"
//                             >

//                                 <h3 className="font-bold text-lg">
//                                     {r.title}
//                                 </h3>

//                                 <p className="text-sm text-gray-500">
//                                     Client: {r.clientName || "—"}
//                                 </p>

//                                 <div className="flex justify-between mt-3 text-sm">

//                                     <span className="flex items-center gap-1 text-green-600 font-semibold">
//                                         <IndianRupee size={14} />
//                                         {r.budget || "—"}
//                                     </span>

//                                     <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
//                                         {r.status}
//                                     </span>

//                                 </div>

//                                 <div className="mt-2 text-sm">
//                                     Progress : {r.progress}%
//                                 </div>

//                             </div>

//                         ))}

//                     </div>

//                     {/* 💻 DESKTOP TABLE */}

//                     <div className="hidden md:block">

//                         <table className="w-full bg-white rounded-xl overflow-hidden">

//                             <thead className="bg-slate-100 text-sm">

//                                 <tr>
//                                     <th className="p-3 text-left">Title</th>
//                                     <th>Client</th>
//                                     <th>Budget</th>
//                                     <th>Status</th>
//                                     <th>Progress</th>
//                                 </tr>

//                             </thead>

//                             <tbody>

//                                 {rows.map((r) => (

//                                     <tr key={r._id} className="border-t">

//                                         <td className="p-3 font-semibold">
//                                             {r.title}
//                                         </td>

//                                         <td>{r.clientName || "—"}</td>

//                                         <td className="flex items-center gap-1">
//                                             <IndianRupee size={12} />
//                                             {r.budget || "—"}
//                                         </td>

//                                         <td>{r.status}</td>

//                                         <td>{r.progress}%</td>

//                                     </tr>

//                                 ))}

//                             </tbody>

//                         </table>

//                     </div>

//                 </>
//             )}

//             {/* Modal */}

//             {modal && (

//                 <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

//                     <div className="bg-white w-full max-w-xl rounded-xl p-6">

//                         <div className="flex justify-between mb-4">

//                             <h2 className="font-bold text-lg">
//                                 Add Project
//                             </h2>

//                             <button onClick={() => setModal(false)}>
//                                 <X size={18} />
//                             </button>

//                         </div>

//                         <div className="grid md:grid-cols-2 gap-4">

//                             <input
//                                 placeholder="Project Title"
//                                 value={form.title}
//                                 onChange={(e) =>
//                                     setForm({ ...form, title: e.target.value })
//                                 }
//                                 className="border p-2 rounded"
//                             />

//                             <input
//                                 placeholder="Client Name"
//                                 value={form.clientName}
//                                 onChange={(e) =>
//                                     setForm({ ...form, clientName: e.target.value })
//                                 }
//                                 className="border p-2 rounded"
//                             />

//                             <input
//                                 type="date"
//                                 value={form.startDate}
//                                 onChange={(e) =>
//                                     setForm({ ...form, startDate: e.target.value })
//                                 }
//                                 className="border p-2 rounded"
//                             />

//                             <input
//                                 type="date"
//                                 value={form.endDate}
//                                 onChange={(e) =>
//                                     setForm({ ...form, endDate: e.target.value })
//                                 }
//                                 className="border p-2 rounded"
//                             />

//                             <input
//                                 type="number"
//                                 placeholder="Budget"
//                                 value={form.budget}
//                                 onChange={(e) =>
//                                     setForm({ ...form, budget: e.target.value })
//                                 }
//                                 className="border p-2 rounded"
//                             />

//                             <select
//                                 value={form.priority}
//                                 onChange={(e) =>
//                                     setForm({ ...form, priority: e.target.value })
//                                 }
//                                 className="border p-2 rounded"
//                             >
//                                 {PRIORITY.map((p) => (
//                                     <option key={p}>{p}</option>
//                                 ))}
//                             </select>

//                             <select
//                                 value={form.status}
//                                 onChange={(e) =>
//                                     setForm({ ...form, status: e.target.value })
//                                 }
//                                 className="border p-2 rounded"
//                             >
//                                 {STATUS.map((s) => (
//                                     <option key={s}>{s}</option>
//                                 ))}
//                             </select>

//                             <input
//                                 type="number"
//                                 placeholder="Progress %"
//                                 value={form.progress}
//                                 onChange={(e) =>
//                                     setForm({ ...form, progress: e.target.value })
//                                 }
//                                 className="border p-2 rounded"
//                             />

//                             <textarea
//                                 placeholder="Project Description"
//                                 value={form.description}
//                                 onChange={(e) =>
//                                     setForm({ ...form, description: e.target.value })
//                                 }
//                                 className="border p-2 rounded md:col-span-2"
//                             />

//                         </div>

//                         <button
//                             onClick={handleSave}
//                             disabled={saving}
//                             className="bg-green-600 text-white w-full mt-6 py-3 rounded"
//                         >
//                             {saving ? "Saving..." : "Save Project"}
//                         </button>

//                     </div>

//                 </div>

//             )}

//         </div>
//     );
// }`
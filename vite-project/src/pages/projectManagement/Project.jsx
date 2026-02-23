// import DataTable from "../../component/DataTable";

// export default function Projects() {
//     return (
//         <DataTable
//             title="Projects"
//             addLabel="Add project"
//             columns={[
//                 { key: "name", label: "Project name" },
//                 { key: "client", label: "Client" },
//                 { key: "lead", label: "Project lead" },
//                 { key: "budget", label: "Budget" },
//             ]}
//             data={[
//                 { name: "App Upgrade", client: "Ivan Bird", lead: "Annika", budget: 50000 },
//                 { name: "Web Portal", client: "Pune Test", lead: "Terry", budget: 120000 },
//             ]}
//         />
//     );
// }



import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
import { projectService } from "../../api/projectService";
import { X, Loader2 } from "lucide-react";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]); // Dropdown ke liye
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", client: "", status: "Pending", startDate: "" });

    const fetchData = async () => {
        try {
            const [projRes, clientRes] = await Promise.all([
                projectService.projectList(),
                projectService.clientList()
            ]);
            // Table ke liye data format karein (nested client name nikalne ke liye)
            const formatted = projRes.data.map(p => ({
                ...p,
                clientName: p.client?.name || "N/A"
            }));
            setProjects(formatted);
            setClients(clientRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await projectService.projectCreate(form);
            setShowModal(false);
            setForm({ name: "", client: "", status: "Pending", startDate: "" });
            fetchData();
        } catch (err) { alert("Save failed"); }
    };

    return (
        <div className="p-6">
            <DataTable
                title="Projects"
                addLabel="Add project"
                onAdd={() => setShowModal(true)}
                isLoading={loading}
                columns={[
                    { key: "name", label: "Project Name" },
                    { key: "clientName", label: "Client" },
                    { key: "status", label: "Status" },
                    { key: "startDate", label: "Start Date" },
                ]}
                data={projects}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl w-[400px] shadow-2xl">
                        <div className="flex justify-between mb-6 border-b pb-2">
                            <h2 className="text-xl font-bold text-slate-800">New Project</h2>
                            <button type="button" onClick={() => setShowModal(false)}><X /></button>
                        </div>

                        <div className="space-y-4">
                            <input
                                required className="w-full p-3 border rounded-xl"
                                placeholder="Project Name"
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />

                            <select
                                required className="w-full p-3 border rounded-xl"
                                onChange={e => setForm({ ...form, client: e.target.value })}
                            >
                                <option value="">Select Client</option>
                                {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>

                            <input
                                type="date" className="w-full p-3 border rounded-xl"
                                onChange={e => setForm({ ...form, startDate: e.target.value })}
                            />

                            <button className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition-all">
                                Create Project
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
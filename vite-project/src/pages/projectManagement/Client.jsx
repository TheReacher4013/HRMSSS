// import DataTable from "../../component/DataTable";

// export default function Client() {
//     return (
//         <DataTable
//             title="Clients"
//             addLabel="New client"
//             columns={[
//                 { key: "name", label: "Client name" },
//                 { key: "company", label: "Company name" },
//                 { key: "email", label: "Email" },
//                 { key: "country", label: "Country" },
//             ]}
//             data={[
//                 { name: "Lovekush", company: "xyz pvt ltd", email: "love@gmail.com", country: "Bangladesh" },
//                 { name: "Ashish", company: "HP", email: "ashish@gmail.com", country: "Bangladesh" },
//                 { name: "Rafi", company: "XYD", email: "rafi@gmail.com", country: "Canada" },
//             ]}
//         />
//     );
// }



import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
import { projectService } from "../../api/projectService";
import { X } from "lucide-react";

export default function Client() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", company: "", email: "", phone: "" });

    const loadData = async () => {
        try {
            const res = await projectService.clientList();
            setData(res.data);
        } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        await projectService.clientCreate(form);
        setShowModal(false);
        loadData();
    };

    return (
        <div className="p-4">
            <DataTable title="Clients" addLabel="New client" onAdd={() => setShowModal(true)} isLoading={loading}
                columns={[{ key: "name", label: "Name" }, { key: "company", label: "Company" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }]}
                data={data} />

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <form onSubmit={handleSave} className="bg-white p-6 rounded-xl w-96">
                        <h2 className="font-bold mb-4">Add New Client</h2>
                        <input className="w-full border p-2 mb-2 rounded" placeholder="Client Name" onChange={e => setForm({ ...form, name: e.target.value })} />
                        <input className="w-full border p-2 mb-2 rounded" placeholder="Company" onChange={e => setForm({ ...form, company: e.target.value })} />
                        <input className="w-full border p-2 mb-2 rounded" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
                        <button className="w-full bg-emerald-700 text-white p-2 rounded">Save</button>
                    </form>
                </div>
            )}
        </div>
    );
}
// import DataTable from "../../component/DataTable";

// export default function Request() {
//     return (
//         <DataTable
//             title="Request list"
//             addLabel="Add new request"
//             columns={[
//                 { key: "person", label: "Requesting person" },
//                 { key: "dept", label: "Department" },
//                 { key: "date", label: "Date" },
//                 { key: "status", label: "Quote status" },
//             ]}
//             data={[
//                 { person: "Adena Rocha", dept: "Marketing", date: "2026-02-10", status: "Not converted" },
//                 { person: "Honorato Terry", dept: "N/A", date: "2025-12-18", status: "Converted" },
//             ]}
//         />
//     );
// }





import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
import { masterService } from "../../api/masterService";

export default function Request() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await masterService.requestList();
            setData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <DataTable
            title="Request list"
            addLabel="Add new request"
            isLoading={loading}
            columns={[
                { key: "person", label: "Requesting person" },
                { key: "dept", label: "Department" },
                { key: "date", label: "Date" },
                { key: "status", label: "Quote status" },
            ]}
            data={data}
        />
    );
}
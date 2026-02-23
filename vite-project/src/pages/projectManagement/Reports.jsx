// import DataTable from "../../component/DataTable";

// export default function Reports() {
//     return (
//         <DataTable
//             title="Reports"
//             addLabel="New report"
//             columns={[
//                 { key: "title", label: "Report title" },
//                 { key: "type", label: "Type" },
//                 { key: "date", label: "Date" },
//             ]}
//             data={[
//                 { title: "Procurement Summary", type: "Monthly", date: "2026-02-10" },
//                 { title: "Vendor Spend", type: "Vendor", date: "2026-02-12" },
//             ]}
//         />
//     );
// }



import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
import { projectService } from "../../api/projectService";

export default function Reports() {
    const [data, setData] = useState([]);

    useEffect(() => {
        projectService.reportList().then(res => setData(res.data));
    }, []);

    return (
        <DataTable title="Reports" addLabel="New report"
            columns={[{ key: "title", label: "Title" }, { key: "type", label: "Type" }, { key: "date", label: "Date" }]}
            data={data} />
    );
}
// import DataTable from "../../component/DataTable";

// export default function GoodsReceived() {
//     return (
//         <DataTable
//             title="Goods received"
//             addLabel="Goods receive"
//             columns={[
//                 { key: "gr", label: "GR no" },
//                 { key: "vendor", label: "Vendor" },
//                 { key: "date", label: "Date" },
//                 { key: "total", label: "Total" },
//             ]}
//             data={[
//                 { gr: "GR-0015", vendor: "REGIONAL", date: "2025-09-02", total: 900 },
//                 { gr: "GR-0014", vendor: "JOKKO", date: "2025-05-29", total: 100000 },
//             ]}
//         />
//     );
// }




import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
// import { inventoryService } from "../../api/inventoryService";

export default function GoodsReceived() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await inventoryService.grList();
            setData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <DataTable
            title="Goods received"
            addLabel="Goods receive"
            isLoading={loading}
            columns={[
                { key: "gr", label: "GR no" },
                { key: "vendor", label: "Vendor" },
                { key: "date", label: "Date" },
                { key: "total", label: "Total" },
            ]}
            data={data}
        />
    );
}
// import DataTable from "../../component/DataTable";

// export default function PurchaseOrder() {
//     return (
//         <DataTable
//             title="Purchase order"
//             addLabel="Add purchase order"
//             columns={[
//                 { key: "po", label: "PO no" },
//                 { key: "vendor", label: "Vendor" },
//                 { key: "loc", label: "Location" },
//                 { key: "total", label: "Total" },
//             ]}
//             data={[
//                 { po: "PO-0015", vendor: "REGIONAL", loc: "Test", total: 900 },
//                 { po: "PO-0014", vendor: "JOKKO", loc: "nsps", total: 100000 },
//             ]}
//         />
//     );
// }





import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
// import { inventoryService } from "../../api/inventoryService";

export default function PurchaseOrder() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await inventoryService.poList();
            setData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <DataTable
            title="Purchase order"
            addLabel="Add purchase order"
            isLoading={loading}
            columns={[
                { key: "po", label: "PO no" },
                { key: "vendor", label: "Vendor" },
                { key: "loc", label: "Location" },
                { key: "total", label: "Total" },
            ]}
            data={data}
        />
    );
}
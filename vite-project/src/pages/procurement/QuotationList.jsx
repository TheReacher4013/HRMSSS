// import DataTable from "../../component/DataTable";

// export default function Quotation() {
//     return (
//         <DataTable
//             title="Quotation list"
//             addLabel="Add quotation"
//             columns={[
//                 { key: "quote", label: "Quotation" },
//                 { key: "company", label: "Company" },
//                 { key: "pin", label: "Pin" },
//                 { key: "date", label: "Date" },
//             ]}
//             data={[
//                 { quote: "QT-00026", company: "REGIONAL", pin: "4132131", date: "2025-12-18" },
//                 { quote: "QT-00025", company: "JOKKO", pin: "1254", date: "2025-10-20" },
//             ]}
//         />
//     );
// }





import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
// import { inventoryService } from "../../api/inventoryService";

export default function Quotation() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await inventoryService.quoteList();
            setData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <DataTable
            title="Quotation list"
            addLabel="Add quotation"
            isLoading={loading}
            columns={[
                { key: "quote", label: "Quotation" },
                { key: "company", label: "Company" },
                { key: "pin", label: "Pin" },
                { key: "date", label: "Date" },
            ]}
            data={data}
        />
    );
}
// import DataTable from "../../component/DataTable";

// export default function Vendors() {
//     return (
//         <DataTable
//             title="Vendor list"
//             addLabel="Add vendor"
//             columns={[
//                 { key: "name", label: "Vendor" },
//                 { key: "mobile", label: "Mobile" },
//                 { key: "email", label: "Email" },
//                 { key: "city", label: "City" },
//             ]}
//             data={[
//                 { name: "reg", mobile: "009877", email: "reg@yahoo.com", city: "Cairo" },
//                 { name: "REGIONAL", mobile: "21922", email: "regional@ms.com", city: "Sao Paulo" },
//             ]}
//         />
//     );
// }




import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
import { masterService } from "../../api/masterService";

export default function Vendors() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await masterService.vendorList();
            setData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <DataTable
            title="Vendor list"
            addLabel="Add vendor"
            isLoading={loading}
            columns={[
                { key: "name", label: "Vendor" },
                { key: "mobile", label: "Mobile" },
                { key: "email", label: "Email" },
                { key: "city", label: "City" },
            ]}
            data={data}
        />
    );
}
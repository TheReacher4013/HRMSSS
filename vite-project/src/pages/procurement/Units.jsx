// import DataTable from "../../component/DataTable";

// export default function Units() {
//     return (
//         <DataTable
//             title="Units list"
//             addLabel="Add unit"
//             columns={[
//                 { key: "name", label: "Unit name" },
//                 { key: "short", label: "Short name" },
//             ]}
//             data={[
//                 { name: "Kilogram", short: "kg" },
//                 { name: "Piece", short: "pc" },
//             ]}
//         />
//     );
// }




import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
import { masterService } from "../../api/masterService";

export default function Units() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await masterService.unitList();
            setData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <DataTable
            title="Units list"
            addLabel="Add unit"
            isLoading={loading}
            columns={[
                { key: "name", label: "Unit name" },
                { key: "short", label: "Short name" },
            ]}
            data={data}
        />
    );
}
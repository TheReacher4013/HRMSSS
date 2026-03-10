import { Type } from "lucide-react";
import DataTable from "../../component/DataTable";

export default function GoodsReceived() {
    return (
        <DataTable
            title="Goods received"
            addLabel="Goods receive"
            columns={[
                { key: "gr", label: "GR no" },
                { key: "vendor", label: "Vendor" },
                { key: "date", label: "Date", type:"date" },
                { key: "total", label: "Total" },
            ]}
            data={[
                { gr: "GR-0015", vendor: "REGIONAL", date: "2025-09-02", total: 900 },
                { gr: "GR-0014", vendor: "JOKKO", date: "2025-05-29", total: 100000 },
            ]}
        />
    );
}

import DataTable from "../../component/DataTable";

export default function PurchaseOrder() {
    return (
        <DataTable
            title="Purchase order"
            addLabel="Add purchase order"
            columns={[
                { key: "po", label: "PO no" },
                { key: "vendor", label: "Vendor" },
                { key: "loc", label: "Location" },
                { key: "total", label: "Total" },
            ]}
            data={[
                { po: "PO-0015", vendor: "REGIONAL", loc: "Test", total: 900 },
                { po: "PO-0014", vendor: "JOKKO", loc: "nsps", total: 100000 },
            ]}
        />
    );
}

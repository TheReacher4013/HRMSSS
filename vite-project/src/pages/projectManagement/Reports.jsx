import DataTable from "../../component/DataTable";

export default function Reports() {
    return (
        <DataTable
            title="Reports"
            addLabel="New report"
            columns={[
                { key: "title", label: "Report title" },
                { key: "type", label: "Type" },
                { key: "date", label: "Date", type: "date" },
            ]}
            data={[
                { title: "Procurement Summary", type: "Monthly", date: "2026-02-10" },
                { title: "Vendor Spend", type: "Vendor", date: "2026-02-12" },
            ]}
        />
    );
}

import DataTable from "../../component/DataTable";

export default function Request() {
    return (
        <DataTable
            title="Request list"
            addLabel="Add new request"
            columns={[
                { key: "person", label: "Requesting person" },
                { key: "dept", label: "Department" },
                { key: "date", label: "Date", type: "date" },
                { key: "status", label: "Quote status" },
            ]}
            data={[
                { person: "Adena Rocha", dept: "Marketing", date: "2026-02-10", status: "Not converted" },
                { person: "Honorato Terry", dept: "N/A", date: "2025-12-18", status: "Converted" },
            ]}
        />
    );
}

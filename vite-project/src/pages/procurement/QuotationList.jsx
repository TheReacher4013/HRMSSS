import DataTable from "../../component/DataTable";

export default function Quotation() {
    return (
        <DataTable
            title="Quotation list"
            addLabel="Add quotation"
            columns={[
                { key: "quote", label: "Quotation" },
                { key: "company", label: "Company" },
                { key: "pin", label: "Pin" },
                { key: "date", label: "Date", type: "date" },
            ]}
            data={[
                { quote: "QT-00026", company: "REGIONAL", pin: "4132131", date: "2025-12-18" },
                { quote: "QT-00025", company: "JOKKO", pin: "1254", date: "2025-10-20" },
            ]}
        />
    );
}

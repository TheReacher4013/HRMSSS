import DataTable from "../../component/DataTable";

export default function BidAnalysis() {
    return (
        <DataTable
            title="Bid analysis"
            addLabel="Add bid analysis"
            columns={[
                { key: "bid", label: "Bid no" },
                { key: "sba", label: "Sba no" },
                { key: "loc", label: "Location" },
                { key: "date", label: "Date", type: "date" },
            ]}
            data={[
                { bid: "BID-00015", sba: "66", loc: "mnn", date: "2025-09-26" },
                { bid: "BID-00014", sba: "Att", loc: "Lkjjj", date: "2025-09-17" },
            ]}
        />
    );
}
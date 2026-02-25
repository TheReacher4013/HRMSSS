import DataTable from "../../component/DataTable";

export default function Units() {
    return (
        <DataTable
            title="Units list"
            addLabel="Add unit"
            columns={[
                { key: "name", label: "Unit name" },
                { key: "short", label: "Short name" },
            ]}
            data={[
                { name: "Kilogram", short: "kg" },
                { name: "Piece", short: "pc" },
            ]}
        />
    );
}

import DataTable from "../../component/DataTable";

export default function Projects() {
    return (
        <DataTable
            title="Projects"
            addLabel="Add project"
            columns={[
                { key: "name", label: "Project name" },
                { key: "client", label: "Client" },
                { key: "lead", label: "Project lead" },
                { key: "budget", label: "Budget" },
            ]}
            data={[
                { name: "App Upgrade", client: "Ivan Bird", lead: "Annika", budget: 50000 },
                { name: "Web Portal", client: "Pune Test", lead: "Terry", budget: 120000 },
            ]}
        />
    );
}

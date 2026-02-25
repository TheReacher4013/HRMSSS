import DataTable from "../../component/DataTable";

export default function TeamMembers() {
    return (
        <DataTable
            title="Team members"
            addLabel="Add member"
            columns={[
                { key: "name", label: "Name" },
                { key: "role", label: "Role" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
            ]}
            data={[
                { name: "Annika", role: "Lead", email: "annika@corp.com", phone: "90000111" },
                { name: "Terry", role: "Manager", email: "terry@corp.com", phone: "90000222" },
            ]}
        />
    );
}

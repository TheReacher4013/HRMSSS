import DataTable from "../../component/DataTable";

export default function Client() {
    return (
        <DataTable
            title="Clients"
            addLabel="New client"
            columns={[
                { key: "name", label: "Client name" },
                { key: "company", label: "Company name" },
                { key: "email", label: "Email" },
                { key: "country", label: "Country" },
            ]}
            data={[
                { name: "Lovekush", company: "xyz pvt ltd", email: "love@gmail.com", country: "Bangladesh" },
                { name: "Ashish", company: "HP", email: "ashish@gmail.com", country: "Bangladesh" },
                { name: "Rafi", company: "XYD", email: "rafi@gmail.com", country: "Canada" },
            ]}
        />
    );
}

import DataTable from "../../component/DataTable";

export default function Vendors() {
    return (
        <DataTable
            title="Vendor list"
            addLabel="Add vendor"
            columns={[
                { key: "name", label: "Vendor" },
                { key: "mobile", label: "Mobile" },
                { key: "email", label: "Email" },
                { key: "city", label: "City" },
            ]}
            data={[
                { name: "reg", mobile: "009877", email: "reg@yahoo.com", city: "Cairo" },
                { name: "REGIONAL", mobile: "21922", email: "regional@ms.com", city: "Sao Paulo" },
            ]}
        />
    );
}

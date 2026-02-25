import DataTable from "../../component/DataTable";

export default function ManageTasks() {
    return (
        <DataTable
            title="Manage tasks"
            addLabel="Add task"
            columns={[
                { key: "project", label: "Project name" },
                { key: "task", label: "Task" },
                { key: "member", label: "Assigned to" },
                { key: "days", label: "Duration" },
            ]}
            data={[
                { project: "App Upgrade", task: "UI Fix", member: "Annika", days: "2 days" },
                { project: "Web Portal", task: "API Build", member: "Lewis", days: "5 days" },
            ]}
        />
    );
}

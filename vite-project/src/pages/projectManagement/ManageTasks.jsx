// import DataTable from "../../component/DataTable";

// export default function ManageTasks() {
//     return (
//         <DataTable
//             title="Manage tasks"
//             addLabel="Add task"
//             columns={[
//                 { key: "project", label: "Project name" },
//                 { key: "task", label: "Task" },
//                 { key: "member", label: "Assigned to" },
//                 { key: "days", label: "Duration" },
//             ]}
//             data={[
//                 { project: "App Upgrade", task: "UI Fix", member: "Annika", days: "2 days" },
//                 { project: "Web Portal", task: "API Build", member: "Lewis", days: "5 days" },
//             ]}
//         />
//     );
// }




import { useState, useEffect } from "react";
import DataTable from "../../component/DataTable";
import { projectService } from "../../api/projectService";

export default function ManageTasks() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: "", project: "", assignedTo: "", status: "Todo" });

    const fetchData = async () => {
        const [t, p, e] = await Promise.all([
            projectService.taskList(),
            projectService.projectList(),
            projectService.employeeList()
        ]);
        // Formatted data for table
        setTasks(t.data.map(task => ({
            ...task,
            projectName: task.project?.name || "N/A",
            memberName: task.assignedTo?.name || "N/A"
        })));
        setProjects(p.data);
        setEmployees(e.data);
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="p-4">
            <DataTable title="Manage Tasks" addLabel="Add Task" onAdd={() => setShowModal(true)}
                columns={[{ key: "title", label: "Task" }, { key: "projectName", label: "Project" }, { key: "memberName", label: "Assigned To" }, { key: "status", label: "Status" }]}
                data={tasks} />

            {/* Modal build logic same as above but with <select> for project and assignedTo */}
        </div>
    );
}
// import React, { useState } from 'react';
// import { Save, CheckCircle2 } from 'lucide-react';

// const InterviewTable = () => {
//     const [marks, setMarks] = useState({ viva: "", written: "", mcq: "" });
//     const [status, setStatus] = useState("Pending");

//     // Logic: Calculate total safely
//     const total = Object.values(marks).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);

//     const handleInputChange = (field, value) => {
//         // Logic: Prevent negative numbers or excessively high numbers
//         if (value < 0) return;
//         setMarks(prev => ({ ...prev, [field]: value }));
//     };

//     const handleSave = () => {
//         if (total === 0) {
//             alert("Please enter marks for at least one category.");
//             return;
//         }

//         setStatus("Saved");
//         console.log("Saving Assessment:", { ...marks, total, timestamp: new Date() });

//         // Reset status after 3 seconds
//         setTimeout(() => setStatus("Pending"), 3000);
//     };

//     return (
//         <div className="p-4 md:p-8 bg-slate-50 min-h-screen flex justify-center items-start lg:items-center">
//             <div className="w-full max-w-2xl">
//                 <div className="mb-6">
//                     <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
//                         Interview Assessment
//                     </h2>
//                     <p className="text-slate-500 text-sm">Enter candidate performance metrics below.</p>
//                 </div>

//                 <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
//                     <div className="p-6 md:p-10 space-y-8">

//                         {/* Responsive Input Grid */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             {[
//                                 { id: 'viva', label: 'Viva Marks' },
//                                 { id: 'written', label: 'Written' },
//                                 { id: 'mcq', label: 'MCQ' }
//                             ].map((field) => (
//                                 <div key={field.id} className="space-y-2">
//                                     <label
//                                         htmlFor={field.id}
//                                         className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
//                                     >
//                                         {field.label}
//                                     </label>
//                                     <input
//                                         id={field.id}
//                                         type="number"
//                                         placeholder="0"
//                                         className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-700"
//                                         value={marks[field.id]}
//                                         onChange={(e) => handleInputChange(field.id, e.target.value)}
//                                     />
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Total Display Section */}
//                         <div className="relative group">
//                             <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
//                             <div className="relative bg-emerald-50 p-6 md:p-8 rounded-[1.5rem] border border-emerald-100 flex flex-col sm:flex-row justify-between items-center gap-4">
//                                 <div>
//                                     <span className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Performance Score</span>
//                                     <span className="font-bold text-emerald-900 text-lg">Grand Total Result</span>
//                                 </div>
//                                 <div className="text-5xl font-black text-emerald-600">
//                                     {total}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Save Button */}
//                         <button
//                             onClick={handleSave}
//                             disabled={status === "Saved"}
//                             className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg
//                                 ${status === "Saved"
//                                     ? "bg-emerald-600 text-white cursor-default"
//                                     : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200"
//                                 }`}
//                         >
//                             {status === "Pending" ? (
//                                 <>
//                                     <Save size={20} />
//                                     <span>Record Assessment</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <CheckCircle2 size={20} />
//                                     <span>Result Saved Successfully</span>
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </div>

//                 <p className="text-center mt-6 text-slate-400 text-xs">
//                     All entries are automatically time-stamped upon saving.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default InterviewTable;





import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { hiringService } from '../../api/hiringService';

const InterviewTable = () => {
    const [marks, setMarks] = useState({ viva: "", written: "", mcq: "", candidateId: "" });
    const [status, setStatus] = useState("Pending");

    const total = Object.values(marks).reduce((acc, curr) => {
        // Sirf numbers ko add karne ke liye
        const val = parseFloat(curr);
        return acc + (isNaN(val) ? 0 : val);
    }, 0);

    const handleInputChange = (field, value) => {
        if (value < 0) return;
        setMarks(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (total === 0) {
            alert("Please enter marks first.");
            return;
        }

        try {
            // Service call to backend
            await hiringService.saveAssessment({ ...marks, total });
            setStatus("Saved");
            // 3 second baad reset
            setTimeout(() => setStatus("Pending"), 3000);
        } catch (err) {
            alert("Failed to save assessment.");
        }
    };

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen flex justify-center items-center">
            <div className="w-full max-w-2xl bg-white rounded-[2rem] border border-slate-200 shadow-xl p-6 md:p-10 space-y-8">
                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Interview Assessment</h2>
                    <p className="text-slate-500 text-sm">Record candidate performance metrics below.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[{ id: 'viva', label: 'Viva' }, { id: 'written', label: 'Written' }, { id: 'mcq', label: 'MCQ' }].map((field) => (
                        <div key={field.id} className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold text-slate-700"
                                value={marks[field.id]}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="relative bg-emerald-50 p-6 md:p-8 rounded-[1.5rem] border border-emerald-100 flex justify-between items-center">
                    <div>
                        <span className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Performance Score</span>
                        <span className="font-bold text-emerald-900 text-lg">Grand Total Result</span>
                    </div>
                    <div className="text-5xl font-black text-emerald-600">{total}</div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={status === "Saved"}
                    className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg
                        ${status === "Saved" ? "bg-emerald-600 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
                >
                    {status === "Pending" ? <><Save size={20} /> Record Assessment</> : <><CheckCircle2 size={20} /> Result Saved</>}
                </button>
            </div>
        </div>
    );
};
export default InterviewTable;
import AddIcon from "../core/icons/AddIcon";
import DeleteIcon from "../core/icons/DeleteIcon";
import ModifyIcon from "../core/icons/ModifyIcon";

export default function Testing({ }) {
    return (
        <div className="flex space-x-2">


            <button className="w-[40px] h-[40px] p-1.5 bg-slate-600 rounded-full flex justify-center items-center shadow-md">
                <AddIcon />
            </button>
            <button className="w-[40px] h-[40px] p-1.5 bg-slate-600 rounded-full flex justify-center items-center shadow-md">
                <ModifyIcon />
            </button>

            <button className="w-[40px] h-[40px] p-2 bg-slate-600 rounded-full flex justify-center items-center shadow-md">
                <DeleteIcon />
            </button>




        </div>
    )
}
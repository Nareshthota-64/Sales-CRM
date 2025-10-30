import React, { useState, useMemo, useRef, useEffect } from 'react';
import PlusIcon from '../../components/icons/PlusIcon';
import FilterIcon from '../../components/icons/FilterIcon';
import SortIcon from '../../components/icons/SortIcon';
import GridViewIcon from '../../components/icons/GridViewIcon';
import ListViewIcon from '../../components/icons/ListViewIcon';
import ColumnViewIcon from '../../components/icons/ColumnViewIcon';
import RowViewIcon from '../../components/icons/RowViewIcon';
import MessageSquareIcon from '../../components/icons/MessageSquareIcon';
import GitBranchIcon from '../../components/icons/GitBranchIcon';
import SettingsIcon from '../../components/icons/SettingsIcon';
import ExportIcon from '../../components/icons/ExportIcon';
import HomeIcon from '../../components/icons/HomeIcon';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';

type Status = 'todo' | 'inprogress' | 'completed';
type Priority = 'Important' | 'Meh' | 'OK' | 'High Priority' | 'Not that important';

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  comments: number;
  assignees: string[];
}

const initialTasks: Task[] = [
  // To Do
  { id: 'task-1', title: 'Identify 50 new prospects in the SaaS industry', priority: 'High Priority', status: 'todo', comments: 5, assignees: ['1', '3'] },
  { id: 'task-2', title: 'Research top 10 competitors for Q3 strategy meeting', priority: 'Important', status: 'todo', comments: 12, assignees: ['2'] },
  { id: 'task-3', title: 'Draft cold outreach email templates for new campaign', priority: 'OK', status: 'todo', comments: 3, assignees: ['1'] },
  { id: 'task-4', title: 'Prepare presentation deck for upcoming webinar on "AI in Sales"', priority: 'Important', status: 'todo', comments: 8, assignees: ['1', '4'] },

  // In Progress
  { id: 'task-5', title: 'Qualify 20 inbound leads from last week\'s marketing campaign', priority: 'High Priority', status: 'inprogress', comments: 25, assignees: ['1', '2'] },
  { id: 'task-6', title: 'Conduct discovery calls with 5 potential enterprise clients', priority: 'Important', status: 'inprogress', comments: 18, assignees: ['4', '5'] },
  { id: 'task-7', title: 'Follow-up with leads from the recent tech conference', priority: 'Meh', status: 'inprogress', comments: 32, assignees: ['6'] },

  // Completed
  { id: 'task-8', title: 'Closed deal with Innovatech Solutions ($50k ARR)', priority: 'Important', status: 'completed', comments: 15, assignees: ['5', '2'] },
  { id: 'task-9', title: 'Submitted Q2 performance and pipeline report to management', priority: 'OK', status: 'completed', comments: 7, assignees: ['1'] },
  { id: 'task-10', title: 'Onboarded 3 new clients from the finance sector successfully', priority: 'OK', status: 'completed', comments: 10, assignees: ['1', '3', '4'] },
];

const assigneeAvatars: { [key: string]: string } = {
  '1': 'https://i.pravatar.cc/150?img=1', '2': 'https://i.pravatar.cc/150?img=2',
  '3': 'https://i.pravatar.cc/150?img=3', '4': 'https://i.pravatar.cc/150?img=4',
  '5': 'https://i.pravatar.cc/150?img=5', '6': 'https://i.pravatar.cc/150?img=6'
};

const priorityStyles: { [key: string]: string } = {
  'Important': 'text-[#4A3AFF] bg-[#E9E7FF]',
  'Meh': 'text-[#FF784A] bg-[#FFF2EE]',
  'OK': 'text-[#32A888] bg-[#EBF9F5]',
  'High Priority': 'text-[#E84242] bg-[#FDEDED]',
  'Not that important': 'text-[#8A8A8A] bg-[#F5F5F5]',
};
const allPriorities: Priority[] = ['Important', 'Meh', 'OK', 'High Priority', 'Not that important'];


interface TaskCardProps {
  task: Task;
  index: number;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onDragStart, isDragging }) => {
    const priorityClass = priorityStyles[task.priority] || 'text-slate-700 bg-slate-100';

    return (
        <div 
            draggable={!!onDragStart}
            onDragStart={onDragStart ? (e) => onDragStart(e, task) : undefined}
            className={`bg-white p-4 rounded-xl border border-slate-100/80 shadow-sm hover:shadow-md transition-all duration-300 ${onDragStart ? 'cursor-grab active:cursor-grabbing' : ''} animate-fade-in ${isDragging ? 'opacity-50 scale-105 shadow-lg' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${priorityClass}`}>{task.priority}</span>
            <p className="mt-3 font-semibold text-slate-800 text-sm">{task.title}</p>
            <div className="flex justify-between items-center mt-4">
                <div className="flex -space-x-2">
                    {task.assignees.slice(0, 3).map(id => <img key={id} src={assigneeAvatars[id]} className="w-7 h-7 rounded-full border-2 border-white" alt="assignee" />)}
                    {task.assignees.length > 3 && <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-slate-600">+{task.assignees.length - 3}</div>}
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                    <MessageSquareIcon className="w-4 h-4" />
                    <span>{task.comments}</span>
                </div>
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{ title: string; status: Status; tasks: Task[]; onAddTask: (status: Status) => void; onDragOver: (e: React.DragEvent<HTMLDivElement>) => void; onDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void; onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void; draggedTask: Task | null }> = ({ title, status, tasks, onAddTask, onDragOver, onDrop, onDragStart, draggedTask }) => {
    const columnStyles = {
        todo: { color: '#4A3AFF', bg: 'bg-[#4A3AFF]', button: 'bg-[#4A3AFF] hover:bg-[#3c2dd1]' },
        inprogress: { color: '#FF784A', bg: 'bg-[#FF784A]', button: 'bg-[#FF784A] hover:bg-[#e86a3d]' },
        completed: { color: '#32A888', bg: 'bg-[#32A888]', button: 'bg-[#32A888] hover:bg-[#2b9074]' },
    };

    return (
        <div 
            className="bg-[#F7F8FA] rounded-xl p-4 min-h-[400px] transition-colors duration-300"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
        >
            <div className={`flex justify-between items-center mb-4`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${columnStyles[status].bg}`}></div>
                    <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">{tasks.length} Total</span>
            </div>
            <div className="space-y-4">
                {status === 'todo' && (
                  <button onClick={() => onAddTask(status)} className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm ${columnStyles[status].button}`}>
                      <PlusIcon className="w-4 h-4" />
                      Add New Task
                  </button>
                )}
                {tasks.map((task, index) => <TaskCard key={task.id} task={task} index={index} onDragStart={onDragStart} isDragging={draggedTask?.id === task.id} />)}
            </div>
        </div>
    );
};

const GridView: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
        ))}
    </div>
);

const ListView: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
    <div className="space-y-2">
        {tasks.map((task) => {
            const priorityClass = priorityStyles[task.priority] || 'text-slate-700 bg-slate-100';
            const statusClasses: Record<Status, string> = {
                todo: 'bg-indigo-100 text-indigo-700 capitalize',
                inprogress: 'bg-amber-100 text-amber-700 capitalize',
                completed: 'bg-green-100 text-green-700 capitalize',
            };
            return (
                <div key={task.id} className="bg-white p-3 rounded-lg border border-slate-100/80 flex justify-between items-center animate-fade-in transition-shadow hover:shadow-md">
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{task.title}</p>
                    </div>
                    <div className="flex items-center gap-4 w-auto sm:w-1/2 ml-4">
                        <div className="w-32 hidden sm:block">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${priorityClass}`}>{task.priority}</span>
                        </div>
                        <div className="w-24 flex -space-x-2">
                            {task.assignees.slice(0, 3).map(id => <img key={id} src={assigneeAvatars[id]} className="w-7 h-7 rounded-full border-2 border-white" alt="assignee" />)}
                        </div>
                        <div className="w-24 hidden md:block">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[task.status]}`}>{task.status === 'inprogress' ? 'In Progress' : task.status}</span>
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);

const RowView: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const statusClasses: Record<Status, string> = {
        todo: 'bg-indigo-100 text-indigo-700 capitalize',
        inprogress: 'bg-amber-100 text-amber-700 capitalize',
        completed: 'bg-green-100 text-green-700 capitalize',
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg border border-slate-200/80">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Task Title</th>
                        <th scope="col" className="px-6 py-3">Priority</th>
                        <th scope="col" className="px-6 py-3">Assignees</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-center">Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={task.id} className="bg-white border-b hover:bg-slate-50 animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                {task.title}
                            </th>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${priorityStyles[task.priority]}`}>{task.priority}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex -space-x-2">
                                    {task.assignees.map(id => <img key={id} src={assigneeAvatars[id]} className="w-8 h-8 rounded-full border-2 border-white" alt="assignee" />)}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[task.status]}`}>{task.status === 'inprogress' ? 'In Progress' : task.status}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-1">
                                    <MessageSquareIcon className="w-4 h-4" />
                                    <span>{task.comments}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const BdeDashboardPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeView, setActiveView] = useState('Column View');
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
    const [sortOrder, setSortOrder] = useState('default');
    
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false);
            }
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setShowSortMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleAddTask = (status: Status) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            title: 'New BDE Task - Qualify Inbound Leads',
            priority: 'Important',
            status: status,
            comments: 0,
            assignees: ['1'],
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
        e.dataTransfer.setData('taskId', task.id);
        setDraggedTask(task);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: Status) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId ? { ...task, status: targetStatus } : task
            )
        );
        setDraggedTask(null);
    };

    const filteredAndSortedTasks = useMemo(() => {
        let allTasks = [...tasks];
        if (filterPriority !== 'All') {
            allTasks = allTasks.filter(task => task.priority === filterPriority);
        }

        switch (sortOrder) {
            case 'title-asc':
                allTasks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                allTasks.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'comments-desc':
                allTasks.sort((a, b) => b.comments - a.comments);
                break;
            case 'comments-asc':
                allTasks.sort((a, b) => a.comments - b.comments);
                break;
            default:
                const statusOrder: Record<Status, number> = { todo: 1, inprogress: 2, completed: 3 };
                allTasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
                break;
        }
        return allTasks;
    }, [tasks, filterPriority, sortOrder]);


    const getTasksForColumn = (status: Status) => {
      // This function already returns filtered and sorted tasks for a specific column
      return filteredAndSortedTasks.filter(task => task.status === status);
    };

    const ViewButton: React.FC<{ view: string; icon: React.ReactNode }> = ({ view, icon }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${activeView === view ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
        >
            {icon}
            {view}
        </button>
    );

    return (
        <div className="bg-white p-6 rounded-2xl min-h-full">
            <header className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                     <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                        <HomeIcon className="w-4 h-4" />
                        <ChevronRightIcon className="w-4 h-4" />
                        <span>Projects</span>
                        <ChevronRightIcon className="w-4 h-4" />
                        <span className="text-slate-800 font-semibold">BDE Project Pipeline</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-slate-800">BDE Project Pipeline</h1>
                        <span className="px-2 py-1 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-700">Label</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <button className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"><SettingsIcon className="w-5 h-5" /></button>
                     <button className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"><GitBranchIcon className="w-5 h-5" /></button>
                     <div className="flex -space-x-2 ml-2">
                        {['1', '2'].map(id => <img key={id} src={assigneeAvatars[id]} className="w-9 h-9 rounded-full border-2 border-white" alt="assignee" />)}
                     </div>
                     <button className="flex items-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors">
                        <ExportIcon className="w-4 h-4" />
                        Export Data
                    </button>
                </div>
            </header>
            
            <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <ViewButton view="Grid View" icon={<GridViewIcon className="w-5 h-5" />} />
                    <ViewButton view="List View" icon={<ListViewIcon className="w-5 h-5" />} />
                    <ViewButton view="Column View" icon={<ColumnViewIcon className="w-5 h-5" />} />
                    <ViewButton view="Row View" icon={<RowViewIcon className="w-5 h-5" />} />
                </div>
                 <div className="flex items-center gap-2">
                    <div className="relative" ref={filterMenuRef}>
                        <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="flex items-center gap-2 py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm font-semibold">
                            <FilterIcon className="w-4 h-4" /> Filter
                            {filterPriority !== 'All' && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
                        </button>
                        {showFilterMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10 animate-fade-in" style={{ animationDuration: '0.2s'}}>
                                <button onClick={() => { setFilterPriority('All'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">All Priorities</button>
                                {allPriorities.map(p => (
                                    <button key={p} onClick={() => { setFilterPriority(p); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{p}</button>
                                ))}
                            </div>
                        )}
                    </div>
                     <div className="relative" ref={sortMenuRef}>
                        <button onClick={() => setShowSortMenu(!showSortMenu)} className="flex items-center gap-2 py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm font-semibold"><SortIcon className="w-4 h-4" /> Sort</button>
                         {showSortMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10 animate-fade-in" style={{ animationDuration: '0.2s'}}>
                                <button onClick={() => { setSortOrder('default'); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Default</button>
                                <button onClick={() => { setSortOrder('title-asc'); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Title (A-Z)</button>
                                <button onClick={() => { setSortOrder('title-desc'); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Title (Z-A)</button>
                                <button onClick={() => { setSortOrder('comments-desc'); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Comments (High-Low)</button>
                                <button onClick={() => { setSortOrder('comments-asc'); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Comments (Low-High)</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <main>
                {activeView === 'Column View' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KanbanColumn title="To Do" status="todo" tasks={getTasksForColumn('todo')} onAddTask={handleAddTask} onDragOver={handleDragOver} onDrop={handleDrop} onDragStart={handleDragStart} draggedTask={draggedTask} />
                        <KanbanColumn title="In Progress" status="inprogress" tasks={getTasksForColumn('inprogress')} onAddTask={handleAddTask} onDragOver={handleDragOver} onDrop={handleDrop} onDragStart={handleDragStart} draggedTask={draggedTask} />
                        <KanbanColumn title="Completed" status="completed" tasks={getTasksForColumn('completed')} onAddTask={handleAddTask} onDragOver={handleDragOver} onDrop={handleDrop} onDragStart={handleDragStart} draggedTask={draggedTask} />
                    </div>
                )}
                {activeView === 'Grid View' && <GridView tasks={filteredAndSortedTasks} />}
                {activeView === 'List View' && <ListView tasks={filteredAndSortedTasks} />}
                {activeView === 'Row View' && <RowView tasks={filteredAndSortedTasks} />}
            </main>
        </div>
    );
};

export default BdeDashboardPage;
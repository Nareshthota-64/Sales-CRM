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
import TaskModal from '../../components/modals/TaskModal';
import ExportModal from '../../components/modals/ExportModal';
import TaskCommentsModal from '../../components/modals/TaskCommentsModal';
import ProjectManagementModal from '../../components/modals/ProjectManagementModal';
import { assigneeAvatars } from '../../components/data/users';
import { mockData } from '../../utils/export';
import CareerPulseWidget from '../../components/bde/CareerPulseWidget';
import { careerUpdatesDB } from '../../components/data/careerUpdatesDB';
import BriefcaseIcon from '../../components/icons/BriefcaseIcon';

type Status = 'todo' | 'inprogress' | 'completed';
type Priority = 'Important' | 'Meh' | 'OK' | 'High Priority' | 'Not that important';

interface Comment {
  user: string;
  avatar: string;
  text: string;
  time: string;
}

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  comments: number;
  assignees: string[];
  assigner?: string;
  commentData?: Comment[];
}

const initialTasks: Task[] = [
  // To Do
  { id: 'task-1', title: 'Identify 50 new prospects in the SaaS industry', priority: 'High Priority', status: 'todo', comments: 1, assignees: ['1', '3'], commentData: [
      { user: 'Benoît Dubois', avatar: assigneeAvatars['2'], text: 'Let\'s aim to get this done by EOD Friday.', time: '10:30 AM' }
  ] },
  { id: 'task-2', title: 'Research top 10 competitors for Q3 strategy meeting', priority: 'Important', status: 'todo', comments: 2, assignees: ['2'], commentData: [
      { user: 'Master Admin', avatar: 'https://i.pravatar.cc/150?img=12', text: 'Please ensure this is comprehensive. The board will be reviewing.', time: 'Yesterday' },
      { user: 'Benoît Dubois', avatar: assigneeAvatars['2'], text: 'Understood. I have started the initial research.', time: '9:00 AM' }
  ] },
  { id: 'task-3', title: 'Draft cold outreach email templates for new campaign', priority: 'OK', status: 'todo', comments: 0, assignees: ['1'], commentData: [] },
  { id: 'task-4', title: 'Prepare presentation deck for upcoming webinar on "AI in Sales"', priority: 'Important', status: 'todo', comments: 0, assignees: ['1', '4'], commentData: [] },

  // In Progress
  { id: 'task-5', title: 'Qualify 20 inbound leads from last week\'s marketing campaign', priority: 'High Priority', status: 'inprogress', comments: 1, assignees: ['1', '2'], commentData: [
    { user: 'Amélie Laurent', avatar: assigneeAvatars['1'], text: 'Halfway through this list. Some promising ones here!', time: '1:15 PM'}
  ] },
  { id: 'task-6', title: 'Conduct discovery calls with 5 potential enterprise clients', priority: 'Important', status: 'inprogress', comments: 0, assignees: ['4', '5'], commentData: [] },
  { id: 'task-7', title: 'Follow-up with leads from the recent tech conference', priority: 'Meh', status: 'inprogress', comments: 0, assignees: ['6'], commentData: [] },

  // Completed
  { id: 'task-8', title: 'Closed deal with Innovatech Solutions ($50k ARR)', priority: 'Important', status: 'completed', comments: 1, assignees: ['5', '2'], commentData: [
    { user: 'David Garcia', avatar: assigneeAvatars['4'], text: 'Great team effort on this one! 🎉', time: '3 days ago'}
  ] },
  { id: 'task-9', title: 'Submitted Q2 performance and pipeline report to management', priority: 'OK', status: 'completed', comments: 0, assignees: ['1'], commentData: [] },
  { id: 'task-10', title: 'Onboarded 3 new clients from the finance sector successfully', priority: 'OK', status: 'completed', comments: 0, assignees: ['1', '3', '4'], commentData: [] },
];


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
  onOpenComments: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onDragStart, isDragging, onOpenComments }) => {
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
                <button onClick={() => onOpenComments(task)} className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded-md transition-colors text-sm font-medium">
                    <MessageSquareIcon className="w-4 h-4" />
                    <span>{task.commentData?.length ?? 0}</span>
                </button>
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{ title: string; status: Status; tasks: Task[]; onAddTask: (status: Status) => void; onDragOver: (e: React.DragEvent<HTMLDivElement>) => void; onDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void; onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void; draggedTask: Task | null; onOpenComments: (task: Task) => void; }> = ({ title, status, tasks, onAddTask, onDragOver, onDrop, onDragStart, draggedTask, onOpenComments }) => {
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
                {tasks.map((task, index) => <TaskCard key={task.id} task={task} index={index} onDragStart={onDragStart} isDragging={draggedTask?.id === task.id} onOpenComments={onOpenComments} />)}
            </div>
        </div>
    );
};

const GridView: React.FC<{ tasks: Task[]; onOpenComments: (task: Task) => void; }> = ({ tasks, onOpenComments }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} onOpenComments={onOpenComments} />
        ))}
    </div>
);

const ListView: React.FC<{ tasks: Task[]; onOpenComments: (task: Task) => void; }> = ({ tasks, onOpenComments }) => (
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
                         <button onClick={() => onOpenComments(task)} className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded-md transition-colors text-sm font-medium">
                            <MessageSquareIcon className="w-4 h-4" />
                            <span>{task.commentData?.length ?? 0}</span>
                        </button>
                    </div>
                </div>
            );
        })}
    </div>
);

const RowView: React.FC<{ tasks: Task[]; onOpenComments: (task: Task) => void; }> = ({ tasks, onOpenComments }) => {
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
                                <button onClick={() => onOpenComments(task)} className="flex items-center justify-center w-full gap-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded-md transition-colors text-sm font-medium">
                                    <MessageSquareIcon className="w-4 h-4" />
                                    <span>{task.commentData?.length ?? 0}</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const BDE_PROJECT_DATA_KEY = 'bde_project_data';
const BDE_CURRENT_USER = 'Amélie Laurent';

const initialProjectData = {
    name: 'BDE Project Pipeline',
    label: 'Internal Project',
    members: [
        { id: '1', name: 'Amélie Laurent', avatar: assigneeAvatars['1'], role: 'Project Lead' },
        { id: '2', name: 'Benoît Dubois', avatar: assigneeAvatars['2'], role: 'Manager' },
        { id: '4', name: 'David Garcia', avatar: assigneeAvatars['4'], role: 'Contributor' },
    ],
    history: [
        { user: 'Amélie Laurent', action: 'moved "Identify 50 new prospects" to In Progress', time: '2h ago' },
        { user: 'Benoît Dubois', action: 'added a new task: "Finalize Q3 targets"', time: '1d ago' },
        { user: 'David Garcia', action: 'completed "Follow up with conference leads"', time: '2d ago' },
    ]
};

const BdeDashboardPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeView, setActiveView] = useState('Column View');
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
    const [sortOrder, setSortOrder] = useState('default');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [selectedTaskForComments, setSelectedTaskForComments] = useState<Task | null>(null);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [projectModalTab, setProjectModalTab] = useState<'settings' | 'members' | 'history'>('settings');
    
    const [projectData, setProjectData] = useState(initialProjectData);
    
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);

    const bdeUpdates = useMemo(() => {
        // In a real app, this would be based on the logged-in user.
        // For this demo, we'll assume the BDE user ID is '1'.
        return careerUpdatesDB.filter(u => u.bdeOwnerId === '1');
    }, []);

    useEffect(() => {
        try {
            const storedTasks = localStorage.getItem('bde_tasks');
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            } else {
                localStorage.setItem('bde_tasks', JSON.stringify(initialTasks));
                setTasks(initialTasks);
            }
        } catch (error) {
            console.error("Failed to load tasks from localStorage", error);
            setTasks(initialTasks);
        }

        try {
            const storedProjectData = localStorage.getItem(BDE_PROJECT_DATA_KEY);
            if (storedProjectData) {
                setProjectData(JSON.parse(storedProjectData));
            } else {
                localStorage.setItem(BDE_PROJECT_DATA_KEY, JSON.stringify(initialProjectData));
            }
        } catch (error) {
            console.error("Failed to load project data from localStorage", error);
            setProjectData(initialProjectData);
        }
    }, []);

    const updateTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
        try {
            localStorage.setItem('bde_tasks', JSON.stringify(newTasks));
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
        }
    };
    
    const updateProjectData = (newData: Partial<typeof initialProjectData>) => {
        setProjectData(prevData => {
            const updatedData = { ...prevData, ...newData };
            try {
                localStorage.setItem(BDE_PROJECT_DATA_KEY, JSON.stringify(updatedData));
            } catch (error) {
                console.error("Failed to save project data to localStorage", error);
            }
            return updatedData;
        });
    };
    
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
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = (newTaskData: { title: string; priority: string; assignees: string[] }) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            title: newTaskData.title,
            priority: newTaskData.priority as Priority,
            status: 'todo',
            comments: 0,
            assignees: newTaskData.assignees,
            assigner: 'bde',
            commentData: [],
        };
        updateTasks([newTask, ...tasks]);
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
        const newTasks = tasks.map(task => 
            task.id === taskId ? { ...task, status: targetStatus } : task
        );
        updateTasks(newTasks);
        setDraggedTask(null);
    };

    const handleOpenComments = (task: Task) => {
        setSelectedTaskForComments(task);
        setIsCommentsModalOpen(true);
    };

    const handleAddComment = (taskId: string, commentText: string) => {
        const newComment: Comment = {
            user: BDE_CURRENT_USER,
            avatar: assigneeAvatars['1'],
            text: commentText,
            time: 'Just now'
        };

        const newTasks = tasks.map(task => {
            if (task.id === taskId) {
                const updatedComments = [...(task.commentData || []), newComment];
                return { ...task, commentData: updatedComments, comments: updatedComments.length };
            }
            return task;
        });
        updateTasks(newTasks);
        // Also update the selected task in the modal to show the new comment instantly
        setSelectedTaskForComments(prevTask => {
            if (prevTask && prevTask.id === taskId) {
                const updatedComments = [...(prevTask.commentData || []), newComment];
                return { ...prevTask, commentData: updatedComments };
            }
            return prevTask;
        });
    };
    
    const handleOpenProjectModal = (tab: 'settings' | 'members' | 'history') => {
        setProjectModalTab(tab);
        setIsProjectModalOpen(true);
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
                allTasks.sort((a, b) => (b.commentData?.length ?? 0) - (a.commentData?.length ?? 0));
                break;
            case 'comments-asc':
                allTasks.sort((a, b) => (a.commentData?.length ?? 0) - (b.commentData?.length ?? 0));
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
        <div className="bg-white p-6 rounded-2xl min-h-full space-y-8">
             <TaskModal 
                isOpen={isTaskModalOpen} 
                onClose={() => setIsTaskModalOpen(false)} 
                onSave={handleSaveTask}
                defaultAssigneeId="1" // Assuming Amélie is user '1'
            />
             <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                availableDataSources={['Tasks']}
                initialSelectedData={['Tasks']}
                data={{ Tasks: filteredAndSortedTasks }}
            />
            <TaskCommentsModal
                isOpen={isCommentsModalOpen}
                onClose={() => setIsCommentsModalOpen(false)}
                task={selectedTaskForComments}
                onAddComment={handleAddComment}
                currentUser={BDE_CURRENT_USER}
            />
            <ProjectManagementModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                initialTab={projectModalTab}
                projectData={projectData}
                onProjectDataChange={updateProjectData}
            />
             <section className="animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BriefcaseIcon className="w-6 h-6 text-indigo-500" />
                    AI Career Pulse
                </h2>
                <CareerPulseWidget updates={bdeUpdates} />
            </section>
            <div>
                <header className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                        <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                            <HomeIcon className="w-4 h-4" />
                            <ChevronRightIcon className="w-4 h-4" />
                            <span>Projects</span>
                            <ChevronRightIcon className="w-4 h-4" />
                            <span className="text-slate-800 font-semibold">{projectData.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-slate-800">{projectData.name}</h1>
                            <span className="px-2 py-1 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-700">{projectData.label}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenProjectModal('settings')} className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"><SettingsIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleOpenProjectModal('history')} className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"><GitBranchIcon className="w-5 h-5" /></button>
                        <div onClick={() => handleOpenProjectModal('members')} className="flex -space-x-2 ml-2 cursor-pointer">
                            {projectData.members.slice(0, 2).map(m => <img key={m.id} src={m.avatar} className="w-9 h-9 rounded-full border-2 border-white" alt="assignee" />)}
                        </div>
                        <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors">
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
                            <KanbanColumn title="To Do" status="todo" tasks={getTasksForColumn('todo')} onAddTask={handleAddTask} onDragOver={handleDragOver} onDrop={handleDrop} onDragStart={handleDragStart} draggedTask={draggedTask} onOpenComments={handleOpenComments} />
                            <KanbanColumn title="In Progress" status="inprogress" tasks={getTasksForColumn('inprogress')} onAddTask={handleAddTask} onDragOver={handleDragOver} onDrop={handleDrop} onDragStart={handleDragStart} draggedTask={draggedTask} onOpenComments={handleOpenComments} />
                            <KanbanColumn title="Completed" status="completed" tasks={getTasksForColumn('completed')} onAddTask={handleAddTask} onDragOver={handleDragOver} onDrop={handleDrop} onDragStart={handleDragStart} draggedTask={draggedTask} onOpenComments={handleOpenComments} />
                        </div>
                    )}
                    {activeView === 'Grid View' && <GridView tasks={filteredAndSortedTasks} onOpenComments={handleOpenComments} />}
                    {activeView === 'List View' && <ListView tasks={filteredAndSortedTasks} onOpenComments={handleOpenComments} />}
                    {activeView === 'Row View' && <RowView tasks={filteredAndSortedTasks} onOpenComments={handleOpenComments} />}
                </main>
            </div>
        </div>
    );
};

export default BdeDashboardPage;
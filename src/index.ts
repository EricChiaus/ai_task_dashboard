import { TaskManager } from './TaskManager.js';
import { UIRenderer } from './UIRenderer.js';
import { Task, TaskFilter } from './types.js';

declare global {
  interface Window {
    confirm: (message?: string) => boolean;
    alert: (message?: any) => void;
  }
}

class TaskDashboard {
    private taskManager: TaskManager;
    private uiRenderer: UIRenderer;
    private currentFilter: TaskFilter = {};
    private editingTaskId: string | null = null;

    constructor() {
        console.log('TaskDashboard constructor called');
        this.taskManager = new TaskManager();
        this.uiRenderer = new UIRenderer();
        this.initializeEventListeners();
        this.render();
        console.log('TaskDashboard constructor completed');
    }

    private initializeEventListeners(): void {
        // Add task button
        const addTaskBtn = document.getElementById('addTaskBtn');
        console.log('Add task button found:', addTaskBtn);
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                console.log('Add task button clicked!');
                this.openModal();
            });
        } else {
            console.error('Add task button not found!');
        }

        // Clear completed button
        document.getElementById('clearCompletedBtn')!.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all completed tasks?')) {
                this.taskManager.clearCompleted();
                this.render();
            }
        });

        // Modal controls
        document.getElementById('cancelBtn')!.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('taskModal')!.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Task form
        document.getElementById('taskForm')!.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTaskSubmit();
        });

        // Filters
        document.getElementById('searchInput')!.addEventListener('input', (e) => {
            this.currentFilter.search = (e.target as HTMLInputElement).value;
            this.render();
        });

        document.getElementById('statusFilter')!.addEventListener('change', (e) => {
            const value = (e.target as HTMLSelectElement).value;
            this.currentFilter.status = (value as any) ?? undefined;
            this.render();
        });

        document.getElementById('priorityFilter')!.addEventListener('change', (e) => {
            const value = (e.target as HTMLSelectElement).value;
            this.currentFilter.priority = (value as any) ?? undefined;
            this.render();
        });

        // Task actions (event delegation)
        document.getElementById('tasksContainer')!.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const taskCard = target.closest('.task-card') as HTMLElement;
            
            if (!taskCard) return;

            const taskId = taskCard.dataset.taskId!;

            if (target.closest('.edit-task')) {
                this.editTask(taskId);
            } else if (target.closest('.delete-task')) {
                this.deleteTask(taskId);
            }
        });
    }

    private render(): void {
        const tasks = this.taskManager.getFilteredTasks(this.currentFilter);
        this.uiRenderer.renderTasks(tasks);
        this.uiRenderer.updateStats(this.taskManager.getStats());
    }

    private openModal(task?: Task): void {
        const modal = document.getElementById('taskModal')!;
        const modalTitle = document.getElementById('modalTitle')!;
        const form = document.getElementById('taskForm')!;

        if (task) {
            this.editingTaskId = task.id;
            modalTitle.textContent = 'Edit Task';
            (document.getElementById('taskTitle') as HTMLInputElement).value = task.title;
            (document.getElementById('taskDescription') as HTMLTextAreaElement).value = task.description;
            (document.getElementById('taskPriority') as HTMLSelectElement).value = task.priority;
            (document.getElementById('taskStatus') as HTMLSelectElement).value = task.status;
        } else {
            this.editingTaskId = null;
            modalTitle.textContent = 'Add New Task';
            (form as HTMLFormElement).reset();
        }

        modal.classList.remove('hidden');
    }

    private closeModal(): void {
        const modal = document.getElementById('taskModal')!;
        modal.classList.add('hidden');
        this.editingTaskId = null;
    }

    private handleTaskSubmit(): void {
        const title = (document.getElementById('taskTitle') as HTMLInputElement).value.trim();
        const description = (document.getElementById('taskDescription') as HTMLTextAreaElement).value.trim();
        const priority = (document.getElementById('taskPriority') as HTMLSelectElement).value as any;
        const status = (document.getElementById('taskStatus') as HTMLSelectElement).value as any;

        if (!title) {
            alert('Please enter a task title');
            return;
        }

        if (this.editingTaskId) {
            this.taskManager.updateTask(this.editingTaskId, {
                title,
                description,
                priority,
                status
            });
        } else {
            this.taskManager.createTask({
                title,
                description,
                priority,
                status
            });
        }

        this.closeModal();
        this.render();
    }

    private editTask(taskId: string): void {
        const task = this.taskManager.getTask(taskId);
        if (task) {
            this.openModal(task);
        }
    }

    private deleteTask(taskId: string): void {
        if (confirm('Are you sure you want to delete this task?')) {
            this.taskManager.deleteTask(taskId);
            this.render();
        }
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing dashboard...');
    new TaskDashboard();
    console.log('Dashboard initialized');
});

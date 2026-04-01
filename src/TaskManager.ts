import { Task, TaskFilter, TaskStats, TaskStatus, TaskPriority } from './types';

export class TaskManager {
    private tasks: Task[] = [];
    private storageKey = 'ai-tasks';

    constructor() {
        this.loadTasks();
    }

    private loadTasks(): void {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                const tasksData = JSON.parse(stored);
                this.tasks = tasksData.map((task: any) => ({
                    ...task,
                    createdAt: new Date(task.createdAt),
                    updatedAt: new Date(task.updatedAt)
                }));
            } catch (error) {
                console.error('Error loading tasks:', error);
                this.tasks = [];
            }
        }
    }

    private saveTasks(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
        const task: Task = {
            ...taskData,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) return null;

        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...updates,
            updatedAt: new Date()
        };

        this.saveTasks();
        return this.tasks[taskIndex];
    }

    deleteTask(id: string): boolean {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) return false;

        this.tasks.splice(taskIndex, 1);
        this.saveTasks();
        return true;
    }

    getTask(id: string): Task | null {
        return this.tasks.find(task => task.id === id) || null;
    }

    getAllTasks(): Task[] {
        return [...this.tasks];
    }

    getFilteredTasks(filter: TaskFilter): Task[] {
        return this.tasks.filter(task => {
            if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase()) &&
                !task.description.toLowerCase().includes(filter.search.toLowerCase())) {
                return false;
            }

            if (filter.status && task.status !== filter.status) {
                return false;
            }

            if (filter.priority && task.priority !== filter.priority) {
                return false;
            }

            return true;
        });
    }

    getStats(): TaskStats {
        return {
            total: this.tasks.length,
            completed: this.tasks.filter(task => task.status === 'completed').length,
            inProgress: this.tasks.filter(task => task.status === 'in-progress').length,
            highPriority: this.tasks.filter(task => task.priority === 'high').length
        };
    }

    clearCompleted(): void {
        this.tasks = this.tasks.filter(task => task.status !== 'completed');
        this.saveTasks();
    }
}

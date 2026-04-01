export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskFilter {
    search?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
}

export interface TaskStats {
    total: number;
    completed: number;
    inProgress: number;
    highPriority: number;
}

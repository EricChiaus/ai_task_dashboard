import { Task, TaskStatus, TaskPriority } from './types';

export class UIRenderer {
    private tasksContainer: HTMLElement;
    private emptyState: HTMLElement;
    private statsElements: {
        total: HTMLElement;
        completed: HTMLElement;
        inProgress: HTMLElement;
        highPriority: HTMLElement;
    };

    constructor() {
        this.tasksContainer = document.getElementById('tasksContainer')!;
        this.emptyState = document.getElementById('emptyState')!;
        this.statsElements = {
            total: document.getElementById('totalTasks')!,
            completed: document.getElementById('completedTasks')!,
            inProgress: document.getElementById('inProgressTasks')!,
            highPriority: document.getElementById('highPriorityTasks')!
        };
    }

    renderTasks(tasks: Task[]): void {
        this.tasksContainer.innerHTML = '';

        if (tasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');
        tasks.forEach(task => this.renderTask(task));
    }

    private renderTask(task: Task): void {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card bg-white rounded-lg shadow-sm p-4 priority-${task.priority} ${task.status === 'completed' ? 'status-completed' : ''}`;
        taskCard.dataset.taskId = task.id;

        const priorityColors = {
            high: 'text-red-600 bg-red-50',
            medium: 'text-yellow-600 bg-yellow-50',
            low: 'text-green-600 bg-green-50'
        };

        const statusColors = {
            pending: 'text-gray-600 bg-gray-50',
            'in-progress': 'text-blue-600 bg-blue-50',
            completed: 'text-green-600 bg-green-50'
        };

        const statusIcons = {
            pending: 'fa-clock',
            'in-progress': 'fa-spinner',
            completed: 'fa-check-circle'
        };

        taskCard.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="task-title font-semibold text-gray-800 flex-1">${this.escapeHtml(task.title)}</h3>
                <div class="flex gap-2 ml-2">
                    <button class="edit-task text-blue-600 hover:text-blue-800" data-task-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-task text-red-600 hover:text-red-800" data-task-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            ${task.description ? `<p class="text-gray-600 text-sm mb-3">${this.escapeHtml(task.description)}</p>` : ''}
            
            <div class="flex flex-wrap gap-2 mb-3">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}">
                    <i class="fas fa-flag mr-1"></i>${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}">
                    <i class="fas ${statusIcons[task.status]} mr-1"></i>${this.formatStatus(task.status)}
                </span>
            </div>
            
            <div class="text-xs text-gray-500">
                Created: ${this.formatDate(task.createdAt)}
                ${task.updatedAt.getTime() !== task.createdAt.getTime() ? `<br>Updated: ${this.formatDate(task.updatedAt)}` : ''}
            </div>
        `;

        this.tasksContainer.appendChild(taskCard);
    }

    updateStats(stats: { total: number; completed: number; inProgress: number; highPriority: number }): void {
        this.statsElements.total.textContent = stats.total.toString();
        this.statsElements.completed.textContent = stats.completed.toString();
        this.statsElements.inProgress.textContent = stats.inProgress.toString();
        this.statsElements.highPriority.textContent = stats.highPriority.toString();
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private formatStatus(status: TaskStatus): string {
        switch (status) {
            case 'pending': return 'Pending';
            case 'in-progress': return 'In Progress';
            case 'completed': return 'Completed';
            default: return status;
        }
    }

    private formatDate(date: Date): string {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
}

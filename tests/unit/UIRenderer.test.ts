import { UIRenderer } from '../../src/UIRenderer';
import { Task, TaskPriority, TaskStatus } from '../../src/types';

// Mock DOM elements
const mockElements = {
  tasksContainer: null as HTMLElement | null,
  emptyState: null as HTMLElement | null,
  totalTasks: null as HTMLElement | null,
  completedTasks: null as HTMLElement | null,
  inProgressTasks: null as HTMLElement | null,
  highPriorityTasks: null as HTMLElement | null,
};

// Mock document.getElementById
document.getElementById = jest.fn((id: string) => {
  return mockElements[id as keyof typeof mockElements];
});

describe('UIRenderer', () => {
  let uiRenderer: UIRenderer;
  let mockContainer: HTMLElement;
  let mockEmptyState: HTMLElement;
  let mockStatsElements: HTMLElement[];

  beforeEach(() => {
    // Create mock DOM elements
    mockContainer = document.createElement('div');
    mockContainer.id = 'tasksContainer';
    mockEmptyState = document.createElement('div');
    mockEmptyState.id = 'emptyState';
    
    mockStatsElements = ['totalTasks', 'completedTasks', 'inProgressTasks', 'highPriorityTasks'].map(id => {
      const element = document.createElement('div');
      element.id = id;
      return element;
    });

    // Set up mock elements
    mockElements.tasksContainer = mockContainer;
    mockElements.emptyState = mockEmptyState;
    mockElements.totalTasks = mockStatsElements[0];
    mockElements.completedTasks = mockStatsElements[1];
    mockElements.inProgressTasks = mockStatsElements[2];
    mockElements.highPriorityTasks = mockStatsElements[3];

    uiRenderer = new UIRenderer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('renderTasks', () => {
    it('should show empty state when no tasks are provided', () => {
      const tasks: Task[] = [];
      
      uiRenderer.renderTasks(tasks);
      
      expect(mockEmptyState.classList.contains('hidden')).toBe(false);
      expect(mockContainer.innerHTML).toBe('');
    });

    it('should hide empty state when tasks are provided', () => {
      const tasks: Task[] = [{
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high' as TaskPriority,
        status: 'pending' as TaskStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      
      uiRenderer.renderTasks(tasks);
      
      expect(mockEmptyState.classList.contains('hidden')).toBe(true);
      expect(mockContainer.innerHTML).toContain('Test Task');
    });

    it('should render task with correct priority class', () => {
      const tasks: Task[] = [{
        id: '1',
        title: 'High Priority Task',
        description: '',
        priority: 'high' as TaskPriority,
        status: 'pending' as TaskStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      
      uiRenderer.renderTasks(tasks);
      
      const taskCard = mockContainer.querySelector('.task-card');
      expect(taskCard).toBeTruthy();
      expect(taskCard!.classList.contains('priority-high')).toBe(true);
    });

    it('should render completed task with correct styling', () => {
      const tasks: Task[] = [{
        id: '1',
        title: 'Completed Task',
        description: '',
        priority: 'medium' as TaskPriority,
        status: 'completed' as TaskStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      
      uiRenderer.renderTasks(tasks);
      
      const taskCard = mockContainer.querySelector('.task-card');
      expect(taskCard).toBeTruthy();
      expect(taskCard!.classList.contains('status-completed')).toBe(true);
      
      const taskTitle = taskCard!.querySelector('.task-title');
      expect(taskTitle).toBeTruthy();
      // The line-through is applied via CSS class, not inline style
    });

    it('should escape HTML in task title and description', () => {
      const tasks: Task[] = [{
        id: '1',
        title: '<script>alert("xss")</script>',
        description: '<img src="x" onerror="alert(1)">',
        priority: 'low' as TaskPriority,
        status: 'pending' as TaskStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      
      uiRenderer.renderTasks(tasks);
      
      expect(mockContainer.innerHTML).not.toContain('<script>');
      expect(mockContainer.innerHTML).not.toContain('<img');
      expect(mockContainer.innerHTML).toContain('&lt;script&gt;');
    });

    it('should render multiple tasks', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: '',
          priority: 'high' as TaskPriority,
          status: 'pending' as TaskStatus,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Task 2',
          description: '',
          priority: 'low' as TaskPriority,
          status: 'completed' as TaskStatus,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      uiRenderer.renderTasks(tasks);
      
      const taskCards = mockContainer.querySelectorAll('.task-card');
      expect(taskCards).toHaveLength(2);
    });
  });

  describe('updateStats', () => {
    it('should update all statistics elements', () => {
      const stats = {
        total: 10,
        completed: 5,
        inProgress: 3,
        highPriority: 2
      };
      
      uiRenderer.updateStats(stats);
      
      expect(mockStatsElements[0].textContent).toBe('10');
      expect(mockStatsElements[1].textContent).toBe('5');
      expect(mockStatsElements[2].textContent).toBe('3');
      expect(mockStatsElements[3].textContent).toBe('2');
    });

    it('should handle zero statistics', () => {
      const stats = {
        total: 0,
        completed: 0,
        inProgress: 0,
        highPriority: 0
      };
      
      uiRenderer.updateStats(stats);
      
      mockStatsElements.forEach(element => {
        expect(element.textContent).toBe('0');
      });
    });
  });

  describe('task card structure', () => {
    it('should include edit and delete buttons', () => {
      const tasks: Task[] = [{
        id: '1',
        title: 'Test Task',
        description: '',
        priority: 'medium' as TaskPriority,
        status: 'pending' as TaskStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      
      uiRenderer.renderTasks(tasks);
      
      const taskCard = mockContainer.querySelector('.task-card');
      expect(taskCard!.querySelector('.edit-task')).toBeTruthy();
      expect(taskCard!.querySelector('.delete-task')).toBeTruthy();
    });

    it('should include priority and status badges', () => {
      const tasks: Task[] = [{
        id: '1',
        title: 'Test Task',
        description: '',
        priority: 'high' as TaskPriority,
        status: 'in-progress' as TaskStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      
      uiRenderer.renderTasks(tasks);
      
      const taskCard = mockContainer.querySelector('.task-card');
      expect(taskCard!.innerHTML).toContain('High');
      expect(taskCard!.innerHTML).toContain('In Progress');
    });

    it('should include creation date', () => {
      const testDate = new Date('2023-01-01T12:00:00');
      const tasks: Task[] = [{
        id: '1',
        title: 'Test Task',
        description: '',
        priority: 'medium' as TaskPriority,
        status: 'pending' as TaskStatus,
        createdAt: testDate,
        updatedAt: testDate
      }];
      
      uiRenderer.renderTasks(tasks);
      
      const taskCard = mockContainer.querySelector('.task-card');
      expect(taskCard!.innerHTML).toContain('Created:');
    });
  });
});

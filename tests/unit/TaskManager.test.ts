import { TaskManager } from '../../src/TaskManager';
import { TaskStatus, TaskPriority } from '../../src/types';

describe('TaskManager', () => {
  let taskManager: TaskManager;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Clear localStorage mock
    mockLocalStorage = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => mockLocalStorage[key] || null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockLocalStorage[key] = value;
    });
    
    taskManager = new TaskManager();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task with valid data', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high' as TaskPriority,
        status: 'pending' as TaskStatus
      };

      const task = taskManager.createTask(taskData);

      expect(task.id).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.priority).toBe(taskData.priority);
      expect(task.status).toBe(taskData.status);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('should save task to localStorage', () => {
      const taskData = {
        title: 'Test Task',
        description: '',
        priority: 'medium' as TaskPriority,
        status: 'pending' as TaskStatus
      };

      taskManager.createTask(taskData);

      expect(localStorage.setItem).toHaveBeenCalledWith('ai-tasks', expect.any(String));
    });
  });

  describe('getAllTasks', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = taskManager.getAllTasks();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks when tasks exist', () => {
      taskManager.createTask({
        title: 'Task 1',
        description: '',
        priority: 'low',
        status: 'pending'
      });

      taskManager.createTask({
        title: 'Task 2',
        description: '',
        priority: 'high',
        status: 'completed'
      });

      const tasks = taskManager.getAllTasks();
      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[1].title).toBe('Task 2');
    });
  });

  describe('getTask', () => {
    it('should return task when valid id is provided', () => {
      const task = taskManager.createTask({
        title: 'Test Task',
        description: '',
        priority: 'medium',
        status: 'pending'
      });

      const foundTask = taskManager.getTask(task.id);
      expect(foundTask).toEqual(task);
    });

    it('should return null when invalid id is provided', () => {
      const foundTask = taskManager.getTask('invalid-id');
      expect(foundTask).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update task when valid id is provided', () => {
      const task = taskManager.createTask({
        title: 'Original Title',
        description: '',
        priority: 'low',
        status: 'pending'
      });

      const updates = {
        title: 'Updated Title',
        status: 'completed' as TaskStatus
      };

      const updatedTask = taskManager.updateTask(task.id, updates);

      expect(updatedTask).not.toBeNull();
      expect(updatedTask!.title).toBe('Updated Title');
      expect(updatedTask!.status).toBe('completed');
      expect(updatedTask!.description).toBe('');
      expect(updatedTask!.priority).toBe('low');
      // updatedAt should be different from original updatedAt
      expect(updatedTask!.updatedAt.getTime()).toBeGreaterThanOrEqual(task.updatedAt.getTime());
    });

    it('should return null when invalid id is provided', () => {
      const result = taskManager.updateTask('invalid-id', { title: 'New Title' });
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete task when valid id is provided', () => {
      const task = taskManager.createTask({
        title: 'Test Task',
        description: '',
        priority: 'medium',
        status: 'pending'
      });

      const result = taskManager.deleteTask(task.id);
      expect(result).toBe(true);

      const foundTask = taskManager.getTask(task.id);
      expect(foundTask).toBeNull();
    });

    it('should return false when invalid id is provided', () => {
      const result = taskManager.deleteTask('invalid-id');
      expect(result).toBe(false);
    });
  });

  describe('getFilteredTasks', () => {
    beforeEach(() => {
      taskManager.createTask({
        title: 'High Priority Task',
        description: 'Important task',
        priority: 'high',
        status: 'pending'
      });

      taskManager.createTask({
        title: 'Completed Task',
        description: 'Finished task',
        priority: 'medium',
        status: 'completed'
      });

      taskManager.createTask({
        title: 'In Progress Task',
        description: 'Working on it',
        priority: 'low',
        status: 'in-progress'
      });
    });

    it('should return all tasks when no filter is applied', () => {
      const tasks = taskManager.getFilteredTasks({});
      expect(tasks).toHaveLength(3);
    });

    it('should filter tasks by search term', () => {
      const tasks = taskManager.getFilteredTasks({ search: 'Important' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('High Priority Task');
    });

    it('should filter tasks by status', () => {
      const tasks = taskManager.getFilteredTasks({ status: 'completed' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Completed Task');
    });

    it('should filter tasks by priority', () => {
      const tasks = taskManager.getFilteredTasks({ priority: 'high' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('High Priority Task');
    });

    it('should apply multiple filters', () => {
      const tasks = taskManager.getFilteredTasks({
        status: 'pending',
        priority: 'high'
      });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('High Priority Task');
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      taskManager.createTask({
        title: 'Task 1',
        description: '',
        priority: 'high',
        status: 'pending'
      });

      taskManager.createTask({
        title: 'Task 2',
        description: '',
        priority: 'high',
        status: 'completed'
      });

      taskManager.createTask({
        title: 'Task 3',
        description: '',
        priority: 'medium',
        status: 'in-progress'
      });

      const stats = taskManager.getStats();
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.inProgress).toBe(1);
      expect(stats.highPriority).toBe(2);
    });

    it('should return zero statistics when no tasks exist', () => {
      const stats = taskManager.getStats();
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.inProgress).toBe(0);
      expect(stats.highPriority).toBe(0);
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed tasks', () => {
      taskManager.createTask({
        title: 'Pending Task',
        description: '',
        priority: 'low',
        status: 'pending'
      });

      taskManager.createTask({
        title: 'Completed Task 1',
        description: '',
        priority: 'medium',
        status: 'completed'
      });

      taskManager.createTask({
        title: 'Completed Task 2',
        description: '',
        priority: 'high',
        status: 'completed'
      });

      taskManager.clearCompleted();

      const remainingTasks = taskManager.getAllTasks();
      expect(remainingTasks).toHaveLength(1);
      expect(remainingTasks[0].title).toBe('Pending Task');
    });
  });
});

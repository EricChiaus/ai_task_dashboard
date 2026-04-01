import { test, expect } from '@playwright/test';

test.describe('Task Management Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear any existing tasks by manually clearing localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test('should load dashboard with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Task Management Dashboard/);
    await expect(page.locator('h1')).toContainText('Task Management Dashboard');
  });

  test('should display empty state when no tasks exist', async ({ page }) => {
    await expect(page.locator('#emptyState')).toBeVisible();
    await expect(page.locator('#emptyState')).toContainText('No tasks found');
    await expect(page.locator('#tasksContainer')).toBeEmpty();
  });

  test('should create a new task', async ({ page }) => {
    // Click add task button
    await page.click('#addTaskBtn');
    
    // Fill in task details
    await page.fill('#taskTitle', 'Test Task');
    await page.fill('#taskDescription', 'This is a test task');
    await page.selectOption('#taskPriority', 'high');
    await page.selectOption('#taskStatus', 'pending');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify task is created
    await expect(page.locator('#emptyState')).toBeHidden();
    await expect(page.locator('.task-card')).toHaveCount(1);
    await expect(page.locator('.task-card')).toContainText('Test Task');
    await expect(page.locator('.task-card')).toContainText('This is a test task');
  });

  test('should edit an existing task', async ({ page }) => {
    // Create a task first
    await page.click('#addTaskBtn');
    await page.fill('#taskTitle', 'Original Task');
    await page.click('button[type="submit"]');
    
    // Edit the task
    await page.click('.edit-task');
    
    // Update task details
    await page.fill('#taskTitle', 'Updated Task');
    await page.selectOption('#taskStatus', 'completed');
    await page.click('button[type="submit"]');
    
    // Verify task is updated
    await expect(page.locator('.task-card')).toContainText('Updated Task');
  });

  test('should delete a task', async ({ page }) => {
    // Create a task first
    await page.click('#addTaskBtn');
    await page.fill('#taskTitle', 'Task to Delete');
    await page.click('button[type="submit"]');
    
    // Delete task
    page.once('dialog', dialog => dialog.accept());
    await page.click('.delete-task');
    
    // Verify task is deleted
    await expect(page.locator('#emptyState')).toBeVisible();
    await expect(page.locator('.task-card')).toHaveCount(0);
  });

  test('should filter tasks by status', async ({ page }) => {
    // Create tasks with different statuses
    await createTask(page, 'Pending Task', 'pending');
    await createTask(page, 'Completed Task', 'completed');
    
    // Filter by completed status
    await page.selectOption('#statusFilter', 'completed');
    
    // Verify only completed tasks are shown
    await expect(page.locator('.task-card')).toHaveCount(1);
    await expect(page.locator('.task-card')).toContainText('Completed Task');
    
    // Reset filter
    await page.selectOption('#statusFilter', '');
    await expect(page.locator('.task-card')).toHaveCount(2);
  });

  test('should filter tasks by priority', async ({ page }) => {
    // Create tasks with different priorities
    await createTaskWithPriority(page, 'High Priority Task', 'high');
    await createTaskWithPriority(page, 'Low Priority Task', 'low');
    
    // Filter by high priority
    await page.selectOption('#priorityFilter', 'high');
    
    // Verify only high priority tasks are shown
    await expect(page.locator('.task-card')).toHaveCount(1);
    await expect(page.locator('.task-card')).toContainText('High Priority Task');
  });

  test('should search tasks', async ({ page }) => {
    // Create multiple tasks
    await createTask(page, 'Important Meeting', 'pending');
    await createTask(page, 'Code Review', 'pending');
    await createTask(page, 'Meeting Notes', 'pending');
    
    // Search for "meeting"
    await page.fill('#searchInput', 'meeting');
    
    // Verify only matching tasks are shown
    await expect(page.locator('.task-card')).toHaveCount(2);
    await expect(page.locator('.task-card').first()).toContainText('Important Meeting');
    await expect(page.locator('.task-card').nth(1)).toContainText('Meeting Notes');
  });

  test('should update statistics correctly', async ({ page }) => {
    // Check initial stats
    await expect(page.locator('#totalTasks')).toContainText('0');
    await expect(page.locator('#completedTasks')).toContainText('0');
    
    // Create tasks
    await createTask(page, 'Task 1', 'pending');
    await createTask(page, 'Task 2', 'completed');
    await createTaskWithPriority(page, 'Task 3', 'high');
    
    // Verify stats are updated
    await expect(page.locator('#totalTasks')).toContainText('3');
    await expect(page.locator('#completedTasks')).toContainText('1');
    await expect(page.locator('#highPriorityTasks')).toContainText('1');
  });

  test('should clear completed tasks', async ({ page }) => {
    // Create completed tasks
    await createTask(page, 'Completed Task 1', 'completed');
    await createTask(page, 'Completed Task 2', 'completed');
    await createTask(page, 'Pending Task', 'pending');
    
    // Clear completed tasks
    page.once('dialog', dialog => dialog.accept());
    await page.click('#clearCompletedBtn');
    
    // Verify only pending task remains
    await expect(page.locator('.task-card')).toHaveCount(1);
    await expect(page.locator('.task-card')).toContainText('Pending Task');
  });

  test('should handle modal interactions correctly', async ({ page }) => {
    // Open modal
    await page.click('#addTaskBtn');
    await expect(page.locator('#taskModal')).toBeVisible();
    
    // Close modal with cancel button
    await page.click('#cancelBtn');
    await expect(page.locator('#taskModal')).toBeHidden();
    
    // Open modal again
    await page.click('#addTaskBtn');
    await expect(page.locator('#taskModal')).toBeVisible();
    
    // Close modal by clicking outside
    await page.click('#taskModal', { position: { x: 10, y: 10 } });
    await expect(page.locator('#taskModal')).toBeHidden();
  });

  test('should validate form inputs', async ({ page }) => {
    // Open modal
    await page.click('#addTaskBtn');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should still be on modal (validation prevented submission)
    await expect(page.locator('#taskModal')).toBeVisible();
  });

  test('should persist data across page reloads', async ({ page }) => {
    // Create a task
    await page.click('#addTaskBtn');
    await page.fill('#taskTitle', 'Persistent Task');
    await page.click('button[type="submit"]');
    
    // Reload page
    await page.reload();
    
    // Task should still be there
    await expect(page.locator('.task-card')).toHaveCount(1);
    await expect(page.locator('.task-card')).toContainText('Persistent Task');
  });
});

// Helper functions
async function createTask(page: any, title: string, status: string) {
  await page.click('#addTaskBtn');
  await page.fill('#taskTitle', title);
  await page.selectOption('#taskStatus', status);
  await page.click('button[type="submit"]');
}

async function createTaskWithPriority(page: any, title: string, priority: string) {
  await page.click('#addTaskBtn');
  await page.fill('#taskTitle', title);
  await page.selectOption('#taskPriority', priority);
  await page.click('button[type="submit"]');
}

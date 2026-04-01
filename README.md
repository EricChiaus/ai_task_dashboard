# Task Management Dashboard

A modern, responsive task management dashboard built with TypeScript, featuring a clean UI with Tailwind CSS and local storage persistence.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Priority Levels**: High, medium, and low priority tasks with visual indicators
- **Status Tracking**: Pending, in-progress, and completed task statuses
- **Search & Filter**: Real-time search and filtering by status and priority
- **Statistics Dashboard**: Live statistics showing total tasks, completed, in-progress, and high-priority items
- **Local Storage**: All tasks are automatically saved to browser local storage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and transitions

## Technology Stack

- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Font Awesome**: Professional icons for UI elements
- **Local Storage API**: Browser-based data persistence

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone or download the project files
2. Navigate to the project directory:
   ```bash
   cd ai_task_dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the TypeScript code:
   ```bash
   npm run build
   ```
5. Start the development server:
   ```bash
   npm run serve
   ```

6. Open your browser and navigate to `http://localhost:8080`

### Development Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch for changes and automatically rebuild
- `npm run serve` - Start a local development server
- `npm start` - Build and serve in one command

## Project Structure

```
ai_task_dashboard/
├── src/
│   ├── index.ts          # Main application entry point
│   ├── types.ts          # TypeScript type definitions
│   ├── TaskManager.ts    # Core task management logic
│   └── UIRenderer.ts     # UI rendering and DOM manipulation
├── dist/                 # Compiled JavaScript output
├── index.html           # Main HTML file
├── package.json         # Project configuration and dependencies
├── tsconfig.json        # TypeScript compiler configuration
└── README.md           # This file
```

## Usage

### Adding Tasks

1. Click the "Add Task" button in the header
2. Fill in the task details:
   - **Title**: Required field for the task name
   - **Description**: Optional detailed description
   - **Priority**: Select from Low, Medium, or High
   - **Status**: Choose from Pending, In Progress, or Completed
3. Click "Save Task" to create the task

### Managing Tasks

- **Edit**: Click the edit icon (pencil) on any task card
- **Delete**: Click the delete icon (trash) on any task card
- **Clear Completed**: Use the "Clear Completed" button to remove all finished tasks

### Filtering and Searching

- **Search**: Use the search bar to find tasks by title or description
- **Status Filter**: Filter tasks by their current status
- **Priority Filter**: Filter tasks by priority level

### Statistics

The dashboard displays real-time statistics:
- **Total Tasks**: Overall number of tasks
- **Completed**: Number of finished tasks
- **In Progress**: Tasks currently being worked on
- **High Priority**: Urgent tasks that need attention

## Data Persistence

All tasks are automatically saved to browser local storage. Your data will persist between browser sessions, even after closing the browser window.

## Browser Support

This application supports all modern browsers:
- Chrome (version 90+)
- Firefox (version 88+)
- Safari (version 14+)
- Edge (version 90+)

## Contributing

Feel free to submit issues or enhancement requests. Key areas for potential improvement:

- Task due dates and reminders
- Task categories or tags
- Drag-and-drop reordering
- Export/import functionality
- Team collaboration features

## License

This project is licensed under the MIT License.

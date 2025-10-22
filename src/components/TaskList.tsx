import { updateTask, deleteTask } from '../lib/tasks'
import type { Task } from '../lib/tasks'
import '../styles/TaskList.css'

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate: () => void
}

export const TaskList = ({ tasks, onTaskUpdate }: TaskListProps) => {
  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateTask(taskId, { status: newStatus })
      onTaskUpdate()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await deleteTask(taskId)
      onTaskUpdate()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'priority-high'
      case 'medium':
        return 'priority-medium'
      case 'low':
        return 'priority-low'
      default:
        return ''
    }
  }


  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-actions">
              <button
                onClick={() => handleDelete(task.id)}
                className="delete-button"
                title="Delete task"
              >
                ×
              </button>
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>

            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
              className="status-select"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {task.due_date && (
              <span className="due-date">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

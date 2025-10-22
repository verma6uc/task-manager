import { updateTask, deleteTask } from '../lib/tasks'
import type { Task } from '../lib/tasks'
import '../styles/TaskTable.css'

interface TaskTableProps {
  tasks: Task[]
  onTaskUpdate: () => void
}

export const TaskTable = ({ tasks, onTaskUpdate }: TaskTableProps) => {
  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateTask(taskId, { status: newStatus })
      onTaskUpdate()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handlePriorityChange = async (taskId: string, newPriority: Task['priority']) => {
    try {
      await updateTask(taskId, { priority: newPriority })
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return { label: 'To Do', className: 'status-badge-todo' }
      case 'in_progress':
        return { label: 'In Progress', className: 'status-badge-progress' }
      case 'done':
        return { label: 'Done', className: 'status-badge-done' }
    }
  }

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return { label: 'High', className: 'priority-badge-high' }
      case 'medium':
        return { label: 'Medium', className: 'priority-badge-medium' }
      case 'low':
        return { label: 'Low', className: 'priority-badge-low' }
    }
  }

  return (
    <div className="table-wrapper">
      <table className="task-table">
        <thead>
          <tr>
            <th className="th-title">Task</th>
            <th className="th-status">Status</th>
            <th className="th-priority">Priority</th>
            <th className="th-date">Created</th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => {
            const statusBadge = getStatusBadge(task.status)
            const priorityBadge = getPriorityBadge(task.priority)

            return (
              <tr key={task.id} className="task-row" style={{ animationDelay: `${index * 0.05}s` }}>
                <td className="td-title">
                  <div className="task-info">
                    <div className="task-name">{task.title}</div>
                    {task.description && (
                      <div className="task-desc">{task.description}</div>
                    )}
                  </div>
                </td>
                <td className="td-status">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                    className={`status-badge ${statusBadge.className}`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td className="td-priority">
                  <select
                    value={task.priority}
                    onChange={(e) => handlePriorityChange(task.id, e.target.value as Task['priority'])}
                    className={`priority-badge ${priorityBadge.className}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </td>
                <td className="td-date">
                  <div className="date-cell">{formatDate(task.created_at)}</div>
                </td>
                <td className="td-actions">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="action-delete"
                    title="Delete task"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

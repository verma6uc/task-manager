import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateTaskInput, TaskStatus, TaskPriority } from '../lib/tasks'
import '../styles/TaskForm.css'

interface TaskFormProps {
  onSubmit: (task: CreateTaskInput) => Promise<void>
  onCancel: () => void
}

export const TaskForm = ({ onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit({
        title,
        description: description || undefined,
        status,
        priority,
      })
      // Reset form
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
    } catch (err: any) {
      setError(err.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-form-overlay" onClick={onCancel}>
      <div className="task-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="task-form-header">
          <h2>Create New Task</h2>
          <button onClick={onCancel} className="close-button">
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

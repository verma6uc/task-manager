import React from 'react'
import type { TaskPriority, TaskStatus } from '../lib/tasks'

interface TaskPriorityIndicatorProps {
  priority: TaskPriority
  status: TaskStatus
}

export const TaskPriorityIndicator: React.FC<TaskPriorityIndicatorProps> = ({ priority, status }) => {
  const shouldHighlight = priority === 'high' || status === 'in_progress'

  if (!shouldHighlight) return null

  return (
    <span className={`priority-indicator priority-${priority} status-${status}`}>
      {priority === 'high' && '🔴'}
      {status === 'in_progress' && '⚡'}
    </span>
  )
}

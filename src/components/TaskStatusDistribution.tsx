import React from 'react'
import '../styles/TaskStatusDistribution.css'

interface TaskStatusDistributionProps {
  todo: number
  inProgress: number
  done: number
}

export const TaskStatusDistribution: React.FC<TaskStatusDistributionProps> = ({
  todo,
  inProgress,
  done,
}) => {
  const total = todo + inProgress + done

  return (
    <div className="task-status-distribution">
      <h3 className="distribution-title">Task Status</h3>
      <div className="status-items">
        <div className="status-item">
          <div className="status-indicator todo"></div>
          <div className="status-info">
            <span className="status-label">To Do</span>
            <span className="status-count">{todo}</span>
          </div>
        </div>
        <div className="status-item">
          <div className="status-indicator in-progress"></div>
          <div className="status-info">
            <span className="status-label">In Progress</span>
            <span className="status-count">{inProgress}</span>
          </div>
        </div>
        <div className="status-item">
          <div className="status-indicator done"></div>
          <div className="status-info">
            <span className="status-label">Done</span>
            <span className="status-count">{done}</span>
          </div>
        </div>
      </div>
      {total > 0 && (
        <div className="total-tasks">
          Total: <strong>{total}</strong> tasks
        </div>
      )}
    </div>
  )
}

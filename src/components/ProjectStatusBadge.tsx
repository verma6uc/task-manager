import React from 'react'
import type { ProjectStatus } from '../lib/projects'

interface ProjectStatusBadgeProps {
  status: ProjectStatus
}

const statusConfig = {
  active: {
    label: 'Active',
    color: '#10b981',
    backgroundColor: '#d1fae5',
  },
  completed: {
    label: 'Completed',
    color: '#3b82f6',
    backgroundColor: '#dbeafe',
  },
  archived: {
    label: 'Archived',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
  },
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status]

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 500,
        color: config.color,
        backgroundColor: config.backgroundColor,
      }}
    >
      {config.label}
    </span>
  )
}

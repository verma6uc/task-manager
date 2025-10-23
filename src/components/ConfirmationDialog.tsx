import React from 'react'
import '../styles/ConfirmationDialog.css'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
}) => {
  if (!isOpen) return null

  return (
    <div className="confirmation-dialog-overlay" onClick={onCancel}>
      <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="confirmation-dialog-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-dialog-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn btn-${variant}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

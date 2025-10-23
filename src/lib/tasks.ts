import { supabase } from './supabase'

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  user_id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  project_id?: string
  created_at: string
  updated_at: string
}

export type CreateTaskInput = {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  project_id?: string
}

export type UpdateTaskInput = {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  project_id?: string
}

// Get all tasks for the current user
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Task[]
}

// Get all tasks for a specific project
export async function getTasksByProject(projectId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Task[]
}

// Get a single task by ID
export async function getTask(id: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Task
}

// Create a new task
export async function createTask(input: CreateTaskInput) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        user_id: user.id,
        title: input.title,
        description: input.description,
        status: input.status || 'todo',
        priority: input.priority || 'medium',
        project_id: input.project_id || null,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as Task
}

// Update a task
export async function updateTask(id: string, input: UpdateTaskInput) {
  const { data, error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Task
}

// Delete a task
export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Get task statistics
export async function getTaskStats() {
  const tasks = await getTasks()

  return {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
  }
}

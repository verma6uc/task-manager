import { supabase } from './supabase'

export type ProjectStatus = 'active' | 'completed' | 'archived'

export type Project = {
  id: string
  user_id: string
  name: string
  description?: string
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export type CreateProjectInput = {
  name: string
  description?: string
  status?: ProjectStatus
}

export type UpdateProjectInput = {
  name?: string
  description?: string
  status?: ProjectStatus
}

// Get all projects for the current user
export async function getProjects(status?: ProjectStatus) {
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Project[]
}

// Get a single project by ID
export async function getProject(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Project
}

// Create a new project
export async function createProject(input: CreateProjectInput) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        user_id: user.id,
        name: input.name,
        description: input.description,
        status: input.status || 'active',
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as Project
}

// Update a project
export async function updateProject(id: string, input: UpdateProjectInput) {
  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Project
}

// Delete a project
export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Get project statistics
export async function getProjectStats(projectId: string) {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('status')
    .eq('project_id', projectId)

  if (error) throw error

  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const todo = tasks.filter(t => t.status === 'todo').length
  const completionPercentage = total > 0 ? (done / total) * 100 : 0

  return {
    total,
    done,
    in_progress: inProgress,
    todo,
    completionPercentage,
  }
}

// Validate project status transitions
export function validateStatusTransition(currentStatus: ProjectStatus, newStatus: ProjectStatus): boolean {
  const allowedTransitions: Record<ProjectStatus, ProjectStatus[]> = {
    active: ['completed', 'archived'],
    completed: ['archived', 'active'],
    archived: ['active'],
  }

  return allowedTransitions[currentStatus]?.includes(newStatus) || currentStatus === newStatus
}

// Update project with status validation
export async function updateProjectWithValidation(id: string, input: UpdateProjectInput) {
  if (input.status) {
    const currentProject = await getProject(id)
    if (!validateStatusTransition(currentProject.status, input.status)) {
      throw new Error(`Cannot transition from ${currentProject.status} to ${input.status}`)
    }
  }

  return updateProject(id, input)
}

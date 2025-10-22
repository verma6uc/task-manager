-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create index on priority for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;

-- Create policy: Users can only see their own tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own tasks
CREATE POLICY "Users can insert their own tasks"
  ON tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own tasks
CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own tasks
CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

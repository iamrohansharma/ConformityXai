import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '/api';

// Types
export interface Assessment {
  id: number;
  userId?: number | null;
  organizationName: string;
  frameworkType: string;
  overallScore: number;
  assessmentData: any;
  status: 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Framework {
  id: number;
  name: string;
  description: string;
  version: string;
  requirements: any;
  createdAt: string;
}

export interface ActionItem {
  id: number;
  assessmentId?: number | null;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'completed';
  dueDate?: string | null;
  frameworkType: string;
  createdAt: string;
  updatedAt: string;
}

// API Functions
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Assessment Hooks
export function useAssessments() {
  return useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: () => fetchApi<Assessment[]>('/assessments'),
  });
}

export function useAssessment(id: number) {
  return useQuery<Assessment>({
    queryKey: ['assessments', id],
    queryFn: () => fetchApi<Assessment>(`/assessments/${id}`),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetchApi<Assessment>('/assessments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Assessment> }) =>
      fetchApi<Assessment>(`/assessments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({ queryKey: ['assessments', variables.id] });
    },
  });
}

// Framework Hooks
export function useFrameworks() {
  return useQuery<Framework[]>({
    queryKey: ['frameworks'],
    queryFn: () => fetchApi<Framework[]>('/frameworks'),
  });
}

export function useFramework(name: string) {
  return useQuery<Framework>({
    queryKey: ['frameworks', name],
    queryFn: () => fetchApi<Framework>(`/frameworks/${encodeURIComponent(name)}`),
    enabled: !!name,
  });
}

// Action Item Hooks
export function useActionItems() {
  return useQuery<ActionItem[]>({
    queryKey: ['actionItems'],
    queryFn: () => fetchApi<ActionItem[]>('/action-items'),
  });
}

export function useCreateActionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetchApi<ActionItem>('/action-items', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
    },
  });
}

export function useUpdateActionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ActionItem> }) =>
      fetchApi<ActionItem>(`/action-items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
    },
  });
}

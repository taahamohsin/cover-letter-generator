import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listResumes, deleteResume, updateResume, uploadResume, getResume } from "./api";
import { toast } from "sonner";
import type { Resume } from "./api";

export function useResumes(limit = 100, offset = 0) {
  return useQuery({
    queryKey: ["resumes", limit, offset],
    queryFn: () => listResumes(limit, offset),
  });
}

export function useResume(id: string | null) {
  return useQuery({
    queryKey: ["resume", id],
    queryFn: () => (id ? getResume(id) : null),
    enabled: !!id,
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, is_default }: { file: File, is_default?: boolean }) => uploadResume(file, is_default),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["resumes"] });
      toast.success("Resume uploaded successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload resume");
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["resumes"] });
      toast.success("Resume deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete resume");
    },
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Resume> }) =>
      updateResume(id, payload),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["resumes"] });
      toast.success("Resume updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update resume");
    },
  });
}
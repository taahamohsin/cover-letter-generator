import { useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { FileText, Upload, ChevronDown, Check, Loader2 } from "lucide-react";
import { useResumes } from "@/lib/useResumes";
import { useAuth } from "@/lib/useAuth";
import { ResumeUploadDialog } from "./resume-upload-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ResumeSelectorProps {
  onResumeSelected: (resumeText: string, resumeId: string, filename: string) => void;
  selectedResumeId?: string;
  selectedFileName?: string;
  className?: string;
}

function TruncatedTooltip({ text, className, side = "right" }: { text: string; className?: string; side?: "top" | "bottom" | "left" | "right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (textRef.current && textRef.current.scrollWidth > textRef.current.clientWidth) {
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <span ref={textRef} className={className}>
            {text}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} className="bg-zinc-900 border-zinc-800 text-zinc-100 p-2 shadow-xl max-w-[300px] break-all">
          <p className="font-semibold text-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function ResumeSelector({
  onResumeSelected,
  selectedResumeId,
  selectedFileName,
  className = "",
}: ResumeSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { user } = useAuth();
  const { data: resumesData, isLoading: isLoadingResumes } = useResumes(undefined, undefined, !!user);

  const resumes = resumesData?.data || [];
  const defaultResume = resumes.find((r) => r.is_default);
  const hasResumes = useMemo(() => !isLoadingResumes && resumes.length > 0, [isLoadingResumes, resumes]);

  const handleSelectResume = (resumeId: string) => {
    const resume = resumes.find((r) => r.id === resumeId);
    if (resume) {
      onResumeSelected(resume.resume_text, resume.id, resume.original_filename);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className={className}>
      <Label className="text-sm font-semibold">Resume</Label>
      {selectedResumeId && selectedFileName ? (
        <div className="mt-2 flex items-center justify-between border border-zinc-200 rounded-md p-3 bg-zinc-50 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-zinc-600" />
            </div>
            <TruncatedTooltip
              text={selectedFileName}
              className="text-sm text-zinc-800 font-medium truncate max-w-[200px] break-all"
              side="right"
            />
          </div>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-4 flex-shrink-0">
                Change
                <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {isLoadingResumes ? (
                <div className="p-4 text-center text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Loading resumes...
                </div>
              ) : resumes.length === 0 ? (
                <div className="p-4 text-center text-sm text-zinc-500">{user ? "No saved resumes" : "Sign in to save resumes"}</div>
              ) : (
                resumes.map((resume) => (
                  <DropdownMenuItem key={resume.id} onClick={() => handleSelectResume(resume.id)}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <div className="min-w-0">
                          <TruncatedTooltip
                            text={resume.original_filename}
                            className="text-sm font-medium break-all truncate block"
                            side="right"
                          />
                          <div className="text-xs text-zinc-500">
                            {(resume.file_size / 1024).toFixed(0)} KB
                            {resume.is_default && " • Default"}
                          </div>
                        </div>
                      </div>
                      {resume.id === selectedResumeId && <Check className="h-4 w-4 text-green-600 flex-shrink-0" />}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload New Resume
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (!user || !hasResumes) && !isLoadingResumes ? (
        <Button
          variant="outline"
          className="w-full mt-2 bg-black text-white hover:bg-primary/90 h-11"
          onClick={() => setIsUploadDialogOpen(true)}
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload Resume
        </Button>
      ) : (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full mt-2 justify-between h-11">
              <span className="flex items-center gap-2 min-w-0">
                <FileText className="h-5 w-5 text-zinc-600 flex-shrink-0" />
                <TruncatedTooltip
                  text={defaultResume ? defaultResume.original_filename : "Select Resume"}
                  className="truncate max-w-[200px] break-all"
                  side="right"
                />
              </span>
              <ChevronDown className="h-4 w-4 text-zinc-400 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
            {isLoadingResumes ? (
              <div className="p-4 text-center text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                Loading resumes...
              </div>
            ) : (
              <>
                {resumes.map((resume) => (
                  <DropdownMenuItem key={resume.id} onClick={() => handleSelectResume(resume.id)}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <div className="min-w-0">
                          <TruncatedTooltip
                            text={resume.original_filename}
                            className="text-sm font-medium break-all truncate block"
                            side="right"
                          />
                          <div className="text-xs text-zinc-500">
                            {(resume.file_size / 1024).toFixed(0)} KB
                            {resume.is_default && " • Default"}
                          </div>
                        </div>
                      </div>
                      {resume.id === selectedResumeId && <Check className="h-4 w-4 text-green-600 flex-shrink-0" />}
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Resume
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      }

      <ResumeUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUploadSuccess={(resume) => onResumeSelected(resume.resume_text, resume.id, resume.original_filename)}
        isAuthenticated={!!user}
      />
    </div >
  );
}
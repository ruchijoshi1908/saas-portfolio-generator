// Resume Upload Component with Drag-and-Drop
// Part of CareerLaunch AI

import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { parseResume } from '../utils/resumeParser';
import { ResumeData } from '../utils/resumeTypes';

interface ResumeUploadProps {
  onResumeParsed: (data: ResumeData) => void;
  onManualEntry: () => void;
  onBack: () => void;
}

type UploadState = 'idle' | 'dragging' | 'uploading' | 'parsing' | 'success' | 'error';

export default function ResumeUpload({ onResumeParsed, onManualEntry, onBack }: ResumeUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const hasValidExtension = validExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      setError('Invalid file format. Please upload a PDF or DOCX file.');
      setUploadState('error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit. Please upload a smaller file.');
      setUploadState('error');
      return;
    }

    setFileName(file.name);
    setUploadState('uploading');
    setUploadProgress(0);
    setError('');

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      setUploadState('parsing');
      setUploadProgress(95);
      const resumeData = await parseResume(file);
      setUploadProgress(100);
      setUploadState('success');

      // Auto-proceed to review after short delay
      setTimeout(() => {
        onResumeParsed(resumeData);
      }, 1500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
      setUploadState('error');
    }
  }, [onResumeParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('idle');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('dragging');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('idle');
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const resetUpload = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setFileName('');
    setError('');
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-neutral-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors mb-8 group"
          >
            <X className="w-4 h-4 group-hover:-translate-x-0 transition-transform" />
            Back to Home
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">AI Resume Parser</span>
          </div>
          <h1 className="section-title gradient-text mb-4">Upload Your Resume</h1>
          <p className="text-neutral-400 text-lg">
            Our AI will extract your information automatically, making portfolio creation effortless.
          </p>
        </div>

        {/* Upload Area */}
        <div className="card-premium p-8">
          {uploadState === 'idle' || uploadState === 'dragging' ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative cursor-pointer transition-all duration-300
                ${uploadState === 'dragging'
                  ? 'border-primary-400/50 bg-primary-500/5'
                  : 'border-neutral-700 hover:border-primary-500/30 bg-neutral-900/50'
                }
                border-2 border-dashed rounded-3xl p-16 text-center
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleInputChange}
                className="hidden"
              />

              <div className={`
                w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 transition-all
                ${uploadState === 'dragging'
                  ? 'bg-primary-500/20 scale-110'
                  : 'bg-neutral-800'
                }
              `}>
                <Upload className={`w-10 h-10 ${uploadState === 'dragging' ? 'text-primary-400' : 'text-neutral-500'}`} />
              </div>

              <h3 className="text-xl font-display font-semibold text-neutral-100 mb-3">
                {uploadState === 'dragging' ? 'Drop your resume here' : 'Drag and drop your resume'}
              </h3>
              <p className="text-neutral-500 mb-6">
                or click to browse from your computer
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  PDF
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  DOCX
                </span>
                <span className="text-neutral-600">Max 10MB</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              {/* Uploading State */}
              {uploadState === 'uploading' && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-primary-500/10 flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-100 mb-3">
                    Uploading resume...
                  </h3>
                  <p className="text-neutral-500 text-sm mb-6">{fileName}</p>
                  <div className="max-w-xs mx-auto">
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-neutral-500 text-sm mt-2">{uploadProgress}%</p>
                  </div>
                </>
              )}

              {/* Parsing State */}
              {uploadState === 'parsing' && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-accent-500/10 flex items-center justify-center mb-6 animate-pulse">
                    <Sparkles className="w-10 h-10 text-accent-400" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-100 mb-3">
                    AI is analyzing your resume...
                  </h3>
                  <p className="text-neutral-500 text-sm mb-6">
                    Extracting your skills, experience, and education
                  </p>
                  <div className="max-w-xs mx-auto">
                    <Loader2 className="w-8 h-8 text-accent-400 animate-spin mx-auto" />
                  </div>
                </>
              )}

              {/* Success State */}
              {uploadState === 'success' && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-green-500/10 flex items-center justify-center mb-6 animate-scale-in">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-100 mb-3">
                    Resume parsed successfully!
                  </h3>
                  <p className="text-neutral-500 text-sm">
                    Redirecting to review your extracted data...
                  </p>
                </>
              )}

              {/* Error State */}
              {uploadState === 'error' && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-100 mb-3">
                    Something went wrong
                  </h3>
                  <p className="text-red-400 text-sm mb-6">{error}</p>
                  <button
                    onClick={resetUpload}
                    className="btn-secondary text-sm"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Manual Entry Option */}
        <div className="text-center mt-8">
          <p className="text-neutral-600 mb-4">Don't have a resume file?</p>
          <button
            onClick={onManualEntry}
            className="btn-outline flex items-center gap-2 mx-auto"
          >
            Enter Information Manually
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { ArrowRight } from 'lucide-react';

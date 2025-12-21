"use client"

import { useState } from "react"
import FileUpload, { DropZone, FileError, FileList, FileInfo } from "@/components/ui/file-upload"

const MAX_FILE_COUNT = 20
const MAX_FILE_SIZE_MB = 10

export default function Home() {
  const [uploadFiles, setUploadFiles] = useState<FileInfo[]>([])

  const onFileSelectChange = (files: FileInfo[]) => {
    setUploadFiles(files)
  }

  const onRemove = (fileId: string) => {
    setUploadFiles(uploadFiles.filter(file => file.id !== fileId))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex w-full max-w-2xl flex-col gap-8 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            File Upload Demo
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Upload up to {MAX_FILE_COUNT} files (PDF, DOCX, DOC, PNG, JPG, JPEG) with a maximum size of {MAX_FILE_SIZE_MB}MB each.
          </p>
        </div>

        <FileUpload
          files={uploadFiles}
          onFileSelectChange={onFileSelectChange}
          multiple={true}
          accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
          maxSize={MAX_FILE_SIZE_MB}
          maxCount={MAX_FILE_COUNT}
          disabled={false}
        >
          <div className="space-y-4">
            <DropZone prompt={`Click or drop up to ${MAX_FILE_COUNT} files to upload`} />
            <FileError />
            <FileList 
              onClear={() => {
                setUploadFiles([])
              }} 
              onRemove={onRemove} 
              canResume={true}
            />
          </div>
        </FileUpload>
      </main>
    </div>
  )
}

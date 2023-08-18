import { TChild } from ".."
import { FileItem } from "./file-item"
import { FolderItem } from "./folder-item"

export function FolderChildren({ files }: { files: TChild[] }) {
  return (
    <div className={"pl-3 border-l-2 flex flex-col gap-3"}>
      {files.map((file) =>
        file.isFolder ? (
          <FolderItem id={file._id} key={file._id} />
        ) : (
          <FileItem id={file._id} key={file._id} />
        )
      )}
    </div>
  )
}

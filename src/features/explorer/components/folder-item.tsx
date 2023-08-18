import { memo } from "react"
import { useBoundStore } from "@/stores/zustand"
import { selectFileById } from ".."
import { FolderChildren } from "./folder-children"
import { FilePlus, FolderMinus, FolderPlus } from "lucide-react"
import { nanoid } from "nanoid"
import { cn } from "@/lib/utils"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

export const FolderItem = memo(({ id }: { id: string }) => {
  const folder = useBoundStore((state) => selectFileById(state, id))
  const addOne = useBoundStore((state) => state.explorer.addOne)
  const removeOne = useBoundStore((state) => state.explorer.removeOne)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })
  const { isOver, setNodeRef: setDropNodeRef } = useDroppable({
    id,
  })

  if (!folder || !folder.children) return <p>Folder not valid!</p>

  const handleRemove = () => {
    removeOne(folder._id)
  }

  const handleAddFile = () => {
    const _id = nanoid(4)
    addOne({ _id, name: `file-${_id}`, children: false, parentId: id })
  }
  const handleAddFolder = () => {
    const _id = nanoid(4)
    addOne({ _id, name: `folder-${_id}`, children: [], parentId: id })
  }
  const style = {
    transform: CSS.Translate.toString(transform),
  }
  return (
    <div
      className={cn(
        " w-full",
        isOver ? "outline-2 outline-offset-2 outline-dashed" : ""
      )}
      ref={setDropNodeRef}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={cn(
          "flex items-center gap-3 mb-3 p-2 rounded-lg ring-1 ring-slate-600 w-full"
        )}
      >
        <p className={"flex-1 font-bold text-xl"}>{folder.name}</p>
        <div className={"flex items-center gap-2"}>
          <button
            onClick={handleAddFile}
            className={"p-1 rounded hover:bg-slate-400"}
          >
            <FilePlus className={"w-6 h-6"} />
          </button>
          <button
            onClick={handleAddFolder}
            className={"p-1 rounded hover:bg-slate-400"}
          >
            <FolderPlus className={"w-6 h-6"} />
          </button>
          <button
            onClick={handleRemove}
            className={"p-1 rounded hover:bg-red-400"}
          >
            <FolderMinus className={"w-6 h-6"} />
          </button>
        </div>
      </div>
      <FolderChildren files={folder.children} />
    </div>
  )
})

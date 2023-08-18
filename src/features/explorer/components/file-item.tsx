import { useBoundStore } from "@/stores/zustand"
import { selectFileById } from ".."
import { memo } from "react"
import { FileMinus } from "lucide-react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

export const FileItem = memo(({ id }: { id: string }) => {
  const file = useBoundStore((state) => selectFileById(state, id))
  const removeOne = useBoundStore((state) => state.explorer.removeOne)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })
  if (!file) return <p>File not found!</p>

  const handleRemove = () => {
    removeOne(file._id)
  }

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={"flex items-center p-2 w-full"}
    >
      <p className={"font-semibold text-slate-500 text-xl flex-1"}>
        {file.name}
      </p>
      <div className={"flex items-center gap-2"}>
        <button
          onClick={handleRemove}
          className={"p-1 rounded hover:bg-red-400"}
        >
          <FileMinus className={"w-6 h-6"} />
        </button>
      </div>
    </div>
  )
})

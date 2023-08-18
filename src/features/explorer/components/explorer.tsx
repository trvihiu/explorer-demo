import { useEffect } from "react"
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"

import { useBoundStore } from "@/stores/zustand"
import { TFile } from ".."
import { FolderItem } from "./folder-item"

export function Explorer() {
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  const loads = useBoundStore((state) => state.explorer.loads)
  const moveFileTo = useBoundStore((state) => state.explorer.moveFileTo)
  const isFolderIncludes = useBoundStore(
    (state) => state.explorer.isFolderIncludes
  )

  useEffect(() => {
    const files: TFile[] = [
      {
        _id: "folder-root",
        name: "folder-root",
        parentId: "",
        children: [
          { _id: "file-1", isFolder: false },
          { _id: "folder-2", isFolder: true },
        ],
      },
      {
        _id: "file-1",
        name: "file-1",
        children: false,
        parentId: "folder-root",
      },
      {
        _id: "folder-2",
        name: "folder-2",
        children: [{ _id: "file-4", isFolder: false }],
        parentId: "folder-root",
      },
      { _id: "file-4", name: "file-4", children: false, parentId: "folder-2" },
    ]
    loads(files)
  }, [loads])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (
      over &&
      active.id !== over.id &&
      !isFolderIncludes(active.id + "", over.id + "")
    ) {
      moveFileTo(active.id, over.id)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className={"p-6"}>
        <FolderItem id={"folder-root"} />
      </div>
    </DndContext>
  )
}

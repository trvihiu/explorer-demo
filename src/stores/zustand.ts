import { create } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import { EntityId, EntityState } from "@/types/entity-adapter"
import { TFile, createExplorerSlice } from "@/features/explorer"

export type ExplorerSlice = EntityState<TFile> & {
  loads: (files: TFile[]) => void
  addOne: (file: TFile) => void
  removeOne: (id: string) => void
  isFolderIncludes: (folderId: string, fileId: string) => boolean
  moveFileTo: (fileId: EntityId, destId: EntityId) => void
}

export type RootState = {
  explorer: ExplorerSlice
}

export const useBoundStore = create<RootState>()(
  subscribeWithSelector(
    devtools((...a) => ({
      ...createExplorerSlice(...a),
    }))
  )
)

// useBoundStore.subscribe((state) => state.todos, console.log)
// useBoundStore.subscribe((state) => state.explorer, console.log)

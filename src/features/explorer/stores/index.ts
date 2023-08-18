import { createEntityAdapter } from "@/lib/entity-adapter"
import { RootState } from "@/stores/zustand"
import { StateCreator } from "zustand"
import { immer } from "zustand/middleware/immer"
import { TChild, TFile } from ".."
import { EntityId, EntityState } from "@/types/entity-adapter"

const adapter = createEntityAdapter<TFile>({
  selectId: (file) => file._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

const initialState = adapter.getInitialState()

const removeRecursively = (draft: EntityState<TFile>, id: EntityId) => {
  const file = draft.entities[id]
  if (file) {
    if (file.children) {
      while (file.children.length > 0) {
        const child = file.children[0]
        removeRecursively(draft, child._id)
      }
    }
    adapter.removeOne(draft, file._id)
    const parentChildren = draft.entities[file.parentId]?.children as TChild[]

    const idx = parentChildren.findIndex((child) => child._id === id)
    if (idx !== -1) {
      parentChildren.splice(idx, 1)
    }
  }
}

export const createExplorerSlice: StateCreator<
  RootState,
  [],
  [["zustand/immer", never]],
  Pick<RootState, "explorer">
> = immer((set, get) => ({
  explorer: {
    ids: initialState.ids,
    entities: initialState.entities,
    loads: (files) => {
      set((draft) => {
        adapter.setAll(draft.explorer, files)
      })
    },
    addOne: (file) => {
      set((draft) => {
        adapter.addOne(draft.explorer, file)

        const parentChildren = draft.explorer.entities[file.parentId]
          ?.children as TChild[]

        parentChildren.push({
          _id: file._id,
          isFolder: !!file.children,
        })
      })
    },
    removeOne: (id) => {
      set((draft) => {
        removeRecursively(draft.explorer, id)
      })
    },
    isFolderIncludes: (folderId, fileId) => {
      const entities = get().explorer.entities
      for (;;) {
        const file = entities[fileId]
        if (!file) return false
        if (file.parentId === folderId) return true
        fileId = file.parentId
      }
    },
    moveFileTo: (fileId, destId) => {
      set((draft) => {
        const file = draft.explorer.entities[fileId]
        const dest = draft.explorer.entities[destId]
        if (file && dest && file?.parentId !== destId) {
          const currentParent = draft.explorer.entities[file.parentId]
          if (currentParent && currentParent.children && dest.children) {
            const idx = currentParent.children.findIndex(
              (child) => child._id === fileId
            )
            if (idx !== -1) {
              const child = currentParent?.children.splice(idx, 1)
              dest.children.push(child[0])
              file.parentId = destId + ""
            }
          }
        }
      })
    },
  },
}))

export const { selectAll: selectAllFiles, selectById: selectFileById } =
  adapter.getSelectors<RootState>((state) => state.explorer)

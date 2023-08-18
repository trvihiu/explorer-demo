import {
  Comparer,
  Dictionary,
  EntityAdapter,
  EntityId,
  EntitySelectors,
  EntityState,
  IdSelector,
  Update,
} from "@/types/entity-adapter"
import { normalize, schema } from "normalizr"

export function createEntityAdapter<T>(options: {
  selectId: IdSelector<T>
  sortComparer: Comparer<T>
}): EntityAdapter<T> {
  const getInitialState = (): EntityState<T> => ({
    ids: [],
    entities: {},
  })

  function getSelectors<V>(
    selectState: (state: V) => EntityState<T>
  ): EntitySelectors<T, V> {
    return {
      selectAll: (state) => {
        const store = selectState(state)
        return store.ids.map((id) => store.entities[id] as T)
      },
      selectIds: (state) => {
        return selectState(state).ids
      },
      selectById: (state, id) => {
        return selectState(state).entities[id]
      },
    }
  }

  function addOne<S extends EntityState<T>>(state: S, entity: T): S {
    const id = options.selectId(entity)
    if (!state.ids.includes(id)) {
      state.ids.push(id)
      state.entities[id] = entity
    }
    return state
  }

  function setAll<S extends EntityState<T>>(state: S, entities: T[]): S {
    if (entities.length === 0) return getInitialState() as S
    const obj = entities[0]
    const id = options.selectId(obj)
    const idAttribute = (
      Object.keys(obj as object) as (keyof typeof obj)[]
    ).find((key) => {
      return obj[key] === id
    })

    const entitySchema = new schema.Entity(
      "_entities",
      {},
      { idAttribute: idAttribute as string }
    )

    const listSchema = [entitySchema]

    const normalizedData = normalize(entities, listSchema)
    state.ids = normalizedData.result

    state.entities = normalizedData.entities._entities as Dictionary<T>

    return state
  }

  function removeOne<S extends EntityState<T>>(state: S, key: EntityId): S {
    const index = state.ids.findIndex((id) => id === key)
    if (index !== -1) {
      state.ids.splice(index, 1)
      delete state.entities[key]
    }
    return state
  }

  function updateOne<S extends EntityState<T>>(state: S, update: Update<T>): S {
    const id = update.id
    if (state.ids.includes(id)) {
      state.entities[id] = { ...(state.entities[id] as T), ...update.changes }
    }
    return state
  }

  function upsertOne<S extends EntityState<T>>(state: S, entity: T): S {
    const id = options.selectId(entity)
    if (!state.ids.includes(id)) {
      addOne(state, entity)
    } else {
      updateOne(state, { id, changes: entity })
    }
    return state
  }

  return {
    selectId: options.selectId,
    sortComparer: options.sortComparer,
    getInitialState,
    getSelectors,
    setAll,
    addOne,
    removeOne,
    updateOne,
    upsertOne,
  }
}

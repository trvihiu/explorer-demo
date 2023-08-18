export type EntityId = number | string

export type Comparer<T> = (a: T, b: T) => number

export type IdSelector<T> = (model: T) => EntityId

export interface Dictionary<T> {
  [id: string | number]: T | undefined
}

export type Update<T> = { id: EntityId; changes: Partial<T> }

export type EntityState<T> = {
  ids: EntityId[]
  entities: Dictionary<T>
}

export interface EntityDefinition<T> {
  selectId: IdSelector<T>
  sortComparer: false | Comparer<T>
}

export interface EntityStateAdapter<T> {
  addOne<S extends EntityState<T>>(state: S, entity: T): S
  // addMany<S extends EntityState<T>>(state: S, entities: T[]): S
  removeOne<S extends EntityState<T>>(state: S, key: EntityId): S
  //   removeMany<S extends EntityState<T>>(state: S, keys: EntityId[]): S
  //   removeAll<S extends EntityState<T>>(state: S): S
  updateOne<S extends EntityState<T>>(state: S, update: Update<T>): S
  //   updateMany<S extends EntityState<T>>(state: S, updates: Update<T>[]): S
  upsertOne<S extends EntityState<T>>(state: S, entity: T): S
  //   upsertMany<S extends EntityState<T>>(state: S, entities: T[]): S
  setAll<S extends EntityState<T>>(state: S, entities: T[]): S
}

export interface EntitySelectors<T, V> {
  selectIds: (state: V) => EntityId[]
  //   selectEntities: (state: V) => Dictionary<T>
  //   selectTotal: (state: V) => number
  selectById: (state: V, id: EntityId) => T | undefined
  selectAll: (state: V) => T[]
}

export interface EntityAdapter<T> extends EntityStateAdapter<T> {
  selectId: IdSelector<T>
  sortComparer: false | Comparer<T>
  getInitialState(): EntityState<T>
  getSelectors<V>(
    selectState: (state: V) => EntityState<T>
  ): EntitySelectors<T, V>
}

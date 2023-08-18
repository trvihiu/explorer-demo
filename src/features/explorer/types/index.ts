export type TChild = {
  _id: string
  isFolder: boolean
}
export type TFile = {
  _id: string
  parentId: string
  name: string
  children: false | TChild[]
}

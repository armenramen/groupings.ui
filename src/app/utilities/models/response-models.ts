export interface Grouping {
  id: string,
  name: string,
  itemsCount: number
}

export interface GroupItemResponse {
  groupName: string,
  items: GroupItem[]
}

export interface GroupItem {
  id: string,
  file: GroupFile,
  details: Detail[]
}

export interface GroupFile {
  name: string,
  extension: string
}

export interface Detail {
  property: string,
  value: any
}

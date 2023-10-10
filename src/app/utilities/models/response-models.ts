export interface TaskGrouping {
  id: string,
  name: string,
  properties: Array<{ name: string, type: string, id: string }>
}

export interface TaskGroupFiles {
  id?: string,
  groupName?: string,
  files: GroupFile[]
}

export interface GroupFile {
  id?: string,
  detail?: GroupFileDetail,
  properties: FileProperty[]
}

export interface GroupFileDetail {
  name: string,
  extension: string,
  createdDate: any,
  modifiedDate: any

}

export interface FileProperty {
  id: string,
  name: string,
  value: any,
  type: ProperyValueType
}

export enum ProperyValueType {
  Boolean = 'boolean',
  String = 'String',
  Date = 'Date',
  Number = 'Number'
}

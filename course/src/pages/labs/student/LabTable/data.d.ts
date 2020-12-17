export interface TableListItem {
  key: number
  disabled?: boolean
  href: string
  name: string
  owner: string
  desc: string
  status: string
  startTime: Date
  endTime: Date
}

export interface TableListPagination {
  total: number
  pageSize: number
  current: number
}

export interface TableListData {
  list: TableListItem[]
  pagination: Partial<TableListPagination>
}

export interface TableListParams {
  status?: string
  name?: string
  desc?: string
  key?: number
  pageSize?: number
  currentPage?: number
  filter?: { [key: string]: any[] }
  sorter?: { [key: string]: any }
}

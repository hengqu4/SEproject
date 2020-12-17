export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  owner: string;
  courseID: string;
  courseName: string;
  courseCredit: number;
  courseStudyTimeNeeded: number;
  courseDescription: string;
  teacherID: string;
  teacherName: string;
  courseStartTime: string;
  courseEndTime: string;
  lectureCount: number;
  experimentCount: number;
  homeworkCount: number;
  contestCount: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  courseID: string;
  courseName: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

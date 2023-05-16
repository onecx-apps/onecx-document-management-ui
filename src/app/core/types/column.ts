import { ColumnType } from './columnType';

export interface Column {
  field: string;
  header: string;
  prefix?: string;
  type?: ColumnType;
  isComplexObject?: boolean;
}

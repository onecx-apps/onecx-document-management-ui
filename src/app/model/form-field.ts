import { FieldType } from './field-type';

export interface FormField {
  label: string;
  name: string;
  type: FieldType;
  required?: boolean;
}

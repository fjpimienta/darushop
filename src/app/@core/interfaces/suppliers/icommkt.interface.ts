export interface ICommktContactInput {
  Email: string;
  CustomFields: CustomFieldInput[];
}

export interface CustomFieldInput {
  Key: string;
  Value: string;
}

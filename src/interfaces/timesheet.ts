export interface ISheetTemplate {
  frontend?: string;
  backend?: string;
  test?: string;
  nodejs?: string;
}

export interface ISheetResult {
  template: ISheetTemplate;
  data: ITimeSheetData[];
}

export interface ITimeSheetData {
  userid: string;
  name: string;
  value?: string;
  groupid?: number;
  createTime?: string;
  updateTime?: string;
}

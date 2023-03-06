export class Result {
  info: Info;
  status: boolean;
  message: string;
  data: any;
}

export class Info {
  page: number;
  pages: number;
  itemsPage: number;
  total: number;
}

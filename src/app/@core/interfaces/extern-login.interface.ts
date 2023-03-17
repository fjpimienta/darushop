export interface ILoginSyscomForm {
  client_id: string;
  client_secret: string;
  grant_type: string;
}

export interface ILoginCTForm {
  email: string;
  cliente: string;
  rfc: string;
}

export interface IResultLogin {
  status: boolean;
  message: string;
  token?: string;
}

export interface IResultLoginCT extends IResultLogin {
}

export interface IResultLoginSyscom extends IResultLogin {
}

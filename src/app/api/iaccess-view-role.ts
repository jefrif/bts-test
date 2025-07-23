export interface AccessViewRole {
  roleId: number;
  accessViewId: number;
  accessViewParentId: number;
  accessViewObject: string;
  ins: boolean;
  upd: boolean;
  del: boolean;
  ron: boolean;
  accessViewPath: string;
}

export interface IaccessViewRole {
  list: AccessViewRole[];
  klinikId: any;
  klinikLogo: string;
  klinikName: string;
  organLayan: any;
  konfig: any;
  isAdmin: boolean;
  sub: string;
  name: string;
  production: boolean;
  userId: string;
}

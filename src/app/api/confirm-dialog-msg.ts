export interface ConfirmDialogMsg {
  header: string;
  message: string;
  icon: string;
  key: string;
  rejectVisible: boolean;
  accept: () => void;
  reject: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
}

export interface IconfirmDialogState {
  param: ConfirmDialogMsg;
}

export interface GMessageState {
  severity: string;
  summary: string;
  detail: string;
}

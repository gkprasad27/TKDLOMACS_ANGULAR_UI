export interface User {
  seqId: number;
  userName: string;
  password: string;
  role: string;
  canEdit: string;
  canDelete: string;
  canAdd: string;
  branchCode: string;
  companyCode: string;
}

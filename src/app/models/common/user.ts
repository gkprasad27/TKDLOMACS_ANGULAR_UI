export interface User {
  seqId: number;
  username: string;
  password: string;
  role: string;
  canEdit: string;
  canDelete: string;
  canAdd: string;
  branchCode: string;
  companyCode: string;
}

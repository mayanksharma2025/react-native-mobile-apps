export interface Report {
  id?: string;

  reportName: string;

  phoneNumber: string;

  isDischarged: boolean;

  selectedPostIds: string[];

  visaReports: string[];

  costEstimateFiles: string[];

  arrivalPhotos: string[];

  userId: string;

  createdAt: number;

  updatedAt: number;
}

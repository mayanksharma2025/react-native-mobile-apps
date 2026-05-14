export type Education = {
  school: string;
  degree: string;
};

export type Experience = {
  company: string;
  role: string;
};

export enum Category {
  Developer = "Developer",
  Designer = "Designer",
  Manager = "Manager",
}

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  address: string;
  photoUrl?: string;

  educations: Education[];
  experiences: Experience[];

  category: Category;

  working: boolean;

  skills: string[];
};

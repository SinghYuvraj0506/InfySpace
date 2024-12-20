import { ReactNode } from "react";

export type ProviderProps = {
  children: ReactNode;
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
};

export type Accounts = {
  id: string;
  accountEmail: string;
  avatar: string;
  provider: "GOOGLE";
  updated_at: string;
};

export type Files = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink: string;
  size: number;
};

export type Filetransfer = {
  id: string;
  name: string;
  mimeType: string;
  progress: number;
  size: string;
  completion_progress: number;
  verfication_status: "PENDING" | "SUCCESS" | "FAILED";
  deletion_status: "PENDING" | "SUCCESS" | "FAILED";
};

export type Transfer = {
  id: string;
  transferSize: string;
  progress?: number;
  fromAccount: Partial<Accounts>;
  toAccount: Partial<Accounts>;
  files: Filetransfer[];
  created_at: string;
};

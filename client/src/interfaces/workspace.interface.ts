export default interface Workspace {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  members?: Array<{
    id: number;
    userId: number;
    role: string;
    user?: {
      id: number;
      email: string;
      name?: string;
    };
  }>;
}
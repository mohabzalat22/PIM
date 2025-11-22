export default interface Team {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  teamMembers?: Array<{
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

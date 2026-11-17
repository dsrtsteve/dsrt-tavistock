export type AppRole = "admin" | "staff" | "user";

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: AppRole;
  image: string | null;
  status: "active" | "inactive" | "pending";
  createdAt: string;
};

export interface UsersRepository {
  listUsers(): Promise<AdminUser[]>;
}

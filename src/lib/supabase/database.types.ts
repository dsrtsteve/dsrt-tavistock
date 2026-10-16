export type PostCategory = "Rescue" | "Training" | "Community" | "Team news";
export type PostStatus = "draft" | "published" | "archived";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: PostCategory;
  status: PostStatus;
  event_date: string;
  location: string | null;
  incident_number: number | null;
  rescue_type: string | null;
  source_url: string | null;
  cover_path: string | null;
  cover_alt: string | null;
  cover_caption: string | null;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: BlogPost;
        Insert: Pick<
          BlogPost,
          "title" | "slug" | "excerpt" | "body" | "event_date"
        > &
          Partial<BlogPost>;
        Update: Partial<BlogPost>;
        Relationships: [];
      };
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

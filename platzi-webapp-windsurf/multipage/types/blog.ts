// Tipos para los posts del blog
export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
}

export interface BlogApiResponse {
  success: boolean;
  count: number;
  data: BlogPost[];
}

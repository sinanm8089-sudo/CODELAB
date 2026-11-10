const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiClient {
  private static tokenKey = "codelab_token";

  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.tokenKey) || localStorage.getItem("codeverse_token");
  }

  static setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  static removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // use default error message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth
  static async register(data: { name: string; email: string; password: string; role?: string }) {
    return this.request<{ access_token: string; user: any }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async login(data: { email: string; password: string }) {
    return this.request<{ access_token: string; user: any }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getMe() {
    return this.request<any>("/api/auth/me");
  }

  static async updateProfile(data: { name?: string; profile_image?: string }) {
    return this.request<any>("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Preferences
  static async getPreferences() {
    return this.request<any>("/api/preferences");
  }

  static async updatePreferences(data: any) {
    return this.request<any>("/api/preferences", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async resetPreferences() {
    return this.request<any>("/api/preferences/reset", {
      method: "POST",
    });
  }

  // Projects
  static async listProjects() {
    return this.request<any[]>("/api/projects");
  }

  static async createProject(data: { title: string; language: string; description?: string; initial_content?: string }) {
    return this.request<any>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getProject(id: number) {
    return this.request<any>(`/api/projects/${id}`);
  }

  static async saveProjectFile(projectId: number, file: { id?: number; filename: string; content: string; language: string }) {
    return this.request<any>(`/api/projects/${projectId}/files`, {
      method: "POST",
      body: JSON.stringify(file),
    });
  }

  static async deleteProject(id: number) {
    return this.request<any>(`/api/projects/${id}`, {
      method: "DELETE",
    });
  }

  static getProjectZipUrl(id: number) {
    return `${API_BASE_URL}/api/projects/${id}/download-zip`;
  }

  // Execution & Debugger
  static async runCode(data: { language: string; source_code: string; stdin?: string }) {
    return this.request<any>("/api/execution/run", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async debugCode(data: { language: string; source_code: string; stdin?: string }) {
    return this.request<any>("/api/execution/debug", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // AI
  static async getAiStatus() {
    return this.request<any>("/api/ai/status");
  }

  static async chat(data: {
    message?: string;
    messages?: Array<{ role: string; content: string }>;
    language?: string;
    mode?: string;
    context_code?: string;
  }) {
    return this.request<{ response: string; engine: string; model: string; status: string }>("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async generate(data: {
    prompt: string;
    language?: string;
    task?: string;
    context_code?: string;
  }) {
    return this.request<{ generated_code: string; explanation?: string; engine: string; model: string }>("/api/ai/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async tutorChat(data: {
    messages: Array<{ role: string; content: string }>;
    language?: string;
    mode?: string;
    explanation_language?: string;
    context_code?: string;
  }) {
    return this.request<any>("/api/ai/tutor", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async explainCode(data: {
    language: string;
    source_code: string;
    selected_line?: number;
    mode?: string;
    explanation_language?: string;
  }) {
    return this.request<any>("/api/ai/explain-code", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async explainError(data: {
    language: string;
    source_code: string;
    stderr: string;
    stdout?: string;
    exit_code?: number;
    explanation_language?: string;
  }) {
    return this.request<any>("/api/ai/explain-error", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Learning
  static async listLessons() {
    return this.request<any[]>("/api/learning/lessons");
  }

  static async getLesson(id: number) {
    return this.request<any>(`/api/learning/lessons/${id}`);
  }

  static async submitQuiz(lessonId: number, selectedIndex: number) {
    return this.request<any>(`/api/learning/lessons/${lessonId}/quiz`, {
      method: "POST",
      body: JSON.stringify({ selected_index: selectedIndex }),
    });
  }

  // Algorithms
  static async listAlgorithms() {
    return this.request<any[]>("/api/algorithms");
  }

  static async getAlgorithm(id: string) {
    return this.request<any>(`/api/algorithms/${id}`);
  }

  // Practice & Exams
  static async listProblems() {
    return this.request<any[]>("/api/practice/problems");
  }

  static async getProblem(id: number) {
    return this.request<any>(`/api/practice/problems/${id}`);
  }

  static async submitSolution(problemId: number, data: { language: string; source_code: string }) {
    return this.request<any>(`/api/practice/problems/${problemId}/submit`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async listSubmissions() {
    return this.request<any[]>("/api/practice/submissions");
  }

  // Focus
  static async logStudySession(data: { duration_seconds: number; session_type?: string }) {
    return this.request<any>("/api/focus/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getFocusSummary() {
    return this.request<any>("/api/focus/summary");
  }

  // Analytics
  static async getAnalyticsOverview() {
    return this.request<any>("/api/analytics/overview");
  }

  static async getNotifications() {
    return this.request<any[]>("/api/analytics/notifications");
  }

  static async markNotificationRead(id: number) {
    return this.request<any>(`/api/analytics/notifications/${id}/read`, {
      method: "POST",
    });
  }

  // Admin
  static async listStudents() {
    return this.request<any[]>("/api/admin/students");
  }

  static async getAdminMetrics() {
    return this.request<any>("/api/admin/metrics");
  }
}


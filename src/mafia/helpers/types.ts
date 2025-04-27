export interface Player {
  name: string;
  role: "mafia" | "town" | "detective" | "doctor";
  bio: string | null;
}

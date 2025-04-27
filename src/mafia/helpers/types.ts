export interface Player {
  name: string;
  role: "mafia" | "town" | "detective" | "doctor";
  alive: boolean;
  bio: string | null;
}

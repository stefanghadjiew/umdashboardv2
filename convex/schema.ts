import { defineSchema } from "convex/server";
import { games } from "./tables/games";
import { users } from "./tables/users";
import { champions } from "./tables/champions";

export default defineSchema({
  games,
  users,
  champions
});
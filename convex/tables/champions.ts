import { defineTable } from "convex/server";
import { v } from "convex/values";

export const championSchema = {
  _id: v.id("champions"), // ✅ proper Convex ID type
  name: v.string(),
  set: v.string(),
  tier: v.string()
};

export const champions = defineTable({
    name: v.string(),
    set: v.string(),
    tier: v.string(),
});
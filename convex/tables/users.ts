import { defineTable } from "convex/server";
import { v } from "convex/values";

export const users = defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
}).index("by_token", ["tokenIdentifier"]);
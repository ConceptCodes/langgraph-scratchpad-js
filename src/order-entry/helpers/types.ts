import { z } from "zod";

export type Language = "en" | "es" | "fr" | "de";

export const draftOrderItemModifierSchema = z.object({
  modifierId: z.number().int(),
  modifierName: z.string().optional(),
  modifierPriceAdjustment: z.number().optional(),
});
export type DraftOrderItemModifier = z.infer<
  typeof draftOrderItemModifierSchema
>;

export const draftOrderItemSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int(),
  productName: z.string().optional(),
  basePrice: z.number().optional(),
  appliedModifiers: z.array(draftOrderItemModifierSchema).optional(),
});
export type DraftOrderItem = z.infer<typeof draftOrderItemSchema>;

export const draftOrderSchema = z.object({
  orderItems: z.array(draftOrderItemSchema),
});
export type DraftOrder = z.infer<typeof draftOrderSchema>;

export const querySchema = z.object({
  query: z.string(),
  params: z.string().array().optional(),
});

export type Query = z.infer<typeof querySchema>;

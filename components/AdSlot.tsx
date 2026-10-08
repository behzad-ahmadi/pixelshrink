export interface AdSlotProps {
  /** Logical slot name for future ad units (e.g. "tool-top"). */
  name?: string;
}

/**
 * Future ad placement. Intentionally renders nothing visible — pages should
 * keep the slot in place so ad units can be enabled without restructuring.
 */
export default function AdSlot({ name = "tool-top" }: AdSlotProps) {
  void name;
  // Placeholder for future ads — no visible output.
  return null;
}

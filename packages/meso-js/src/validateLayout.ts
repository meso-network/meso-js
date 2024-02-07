import { Position } from "./types";

/** The values from the `Position` enum. */
type PositionValue = `${Position}`;

/** Determine if a provided `position` is valid. */
export const isValidPosition = (position?: PositionValue) =>
  position && Object.values(Position).some((value) => value === position);

/**
 * Determine if a given layout value is a valid non-negative integer without units.
 */
export const isValidOffsetValue = (offsetValue: PixelValue): boolean =>
  /^\d+$/.test(offsetValue) && parseInt(offsetValue, 10) >= 0;

/**
 * Validate provided layout configurations.
 */
export const validateLayout = (
  layout: TransferConfiguration["layout"],
): { isValid: true } | { isValid: false; message: string } => {
  if (layout === undefined) {
    return { isValid: true };
  }

  if ("position" in layout && !isValidPosition(layout.position)) {
    return {
      isValid: false,
      message: `"position" must be a supported Position: ${Object.values(
        Position,
      )}.`,
    };
  }

  if ("offset" in layout) {
    // validate offset string value
    if (typeof layout.offset === "string") {
      if (!isValidOffsetValue(layout.offset)) {
        return {
          isValid: false,
          message: `"offset" must be a non-negative integer (without units).`,
        };
      }
    }

    // validate offset object
    if (typeof layout.offset === "object") {
      if (
        layout?.offset.horizontal &&
        !isValidOffsetValue(layout.offset.horizontal)
      ) {
        return {
          isValid: false,
          message: `"offset.horizontal" must be a non-negative integer (without units).`,
        };
      }

      if (
        layout?.offset.vertical &&
        !isValidOffsetValue(layout.offset.vertical)
      ) {
        return {
          isValid: false,
          message: `"offset.vertical" must be a non-negative integer (without units).`,
        };
      }

      if (!layout?.offset?.horizontal && !layout?.offset?.vertical) {
        return {
          isValid: false,
          message:
            'A valid value must be provided for "offset.horizontal" and/or "offset.vertical".',
        };
      }
    }
  }

  return { isValid: true };
};

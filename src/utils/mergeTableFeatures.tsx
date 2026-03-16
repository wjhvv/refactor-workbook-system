import { Fragment } from "react";
import type { TableFeatureProps } from "../types/tableFeature";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Compose class getters: all contributions are concatenated with a space. */
function composeClassGetters<A extends unknown[]>(
  getters: ((...args: A) => string | undefined)[],
): ((...args: A) => string | undefined) | undefined {
  const active = getters.filter(Boolean);
  if (active.length === 0) return undefined;
  return (...args: A) => {
    const parts = active.map((g) => g(...args)).filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : undefined;
  };
}

/** Compose event handlers: all are called in order. */
function composeHandlers<A extends unknown[]>(
  handlers: ((...args: A) => void)[],
): ((...args: A) => void) | undefined {
  const active = handlers.filter(Boolean);
  if (active.length === 0) return undefined;
  return (...args: A) => active.forEach((h) => h(...args));
}

// ─── Export ───────────────────────────────────────────────────────────────────

/**
 * Merge multiple feature prop objects into one.
 *
 * - Class getters  → concatenated (all contributions applied)
 * - Event handlers → all called in order
 * - renderLeadingCell → stacked in a flex column when multiple
 * - headerActions  → stacked in a fragment when multiple
 * - noSelect       → true if any feature sets it
 */
export function mergeTableFeatures(
  ...features: Partial<TableFeatureProps>[]
): TableFeatureProps {
  const leadingRenderers = features
    .map((f) => f.renderLeadingCell)
    .filter((r): r is NonNullable<typeof r> => r != null);

  const renderLeadingCell =
    leadingRenderers.length === 0
      ? undefined
      : leadingRenderers.length === 1
        ? leadingRenderers[0]
        : (rowIndex: number) => (
            <div className="flex flex-col gap-0.5">
              {leadingRenderers.map((r, i) => (
                <Fragment key={i}>{r(rowIndex)}</Fragment>
              ))}
            </div>
          );

  const actionNodes = features
    .map((f) => f.headerActions)
    .filter((a) => a != null);
  const headerActions =
    actionNodes.length === 0 ? undefined : actionNodes.length === 1 ? (
      actionNodes[0]
    ) : (
      <>
        {actionNodes.map((a, i) => (
          <Fragment key={i}>{a}</Fragment>
        ))}
      </>
    );

  return {
    getRowClass: composeClassGetters(
      features
        .map((f) => f.getRowClass)
        .filter((g): g is NonNullable<typeof g> => g != null),
    ),
    getCellClass: composeClassGetters(
      features
        .map((f) => f.getCellClass)
        .filter((g): g is NonNullable<typeof g> => g != null),
    ),
    getHeaderCellClass: composeClassGetters(
      features
        .map((f) => f.getHeaderCellClass)
        .filter((g): g is NonNullable<typeof g> => g != null),
    ),
    onRowClick: composeHandlers(
      features
        .map((f) => f.onRowClick)
        .filter((h): h is NonNullable<typeof h> => h != null),
    ),
    onHeaderCellClick: composeHandlers(
      features
        .map((f) => f.onHeaderCellClick)
        .filter((h): h is NonNullable<typeof h> => h != null),
    ),
    renderLeadingCell,
    headerActions,
    noSelect: features.some((f) => f.noSelect),
  };
}

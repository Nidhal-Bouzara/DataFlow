import { WORKFLOW_THEME } from "@/lib/workflowTheme";

/**
 * Execution timing utilities
 *
 * Wraps timing logic with declarative API to separate
 * timing concerns from execution orchestration.
 */

/**
 * Helper function to wait for a specified duration
 */
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper function to generate random delay within range
 */
const randomDelay = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Waits for a randomized node processing time based on theme configuration
 *
 * Simulates the time a node takes to process data, using the
 * min/max range from WORKFLOW_THEME.execution.nodeProcessTime
 *
 * @returns Promise that resolves after random processing delay
 *
 * @example
 * ```ts
 * await timing.waitForNodeProcessing();
 * // Node processing complete, ready to show completion state
 * ```
 */
export async function waitForNodeProcessing(): Promise<void> {
  const { min, max } = WORKFLOW_THEME.execution.nodeProcessTime;
  await wait(randomDelay(min, max));
}

/**
 * Waits for data to travel through edges based on theme configuration
 *
 * Uses WORKFLOW_THEME.execution.edgeTravelTime for consistent
 * data packet animation timing across all edges
 *
 * @returns Promise that resolves after edge travel delay
 *
 * @example
 * ```ts
 * await timing.waitForEdgeTravel();
 * // Data packet has reached destination nodes
 * ```
 */
export async function waitForEdgeTravel(): Promise<void> {
  const { edgeTravelTime } = WORKFLOW_THEME.execution;
  await wait(edgeTravelTime);
}

/**
 * Waits for a fixed duration (utility for workflow completion, etc.)
 *
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after specified delay
 *
 * @example
 * ```ts
 * await timing.waitFixed(1000);
 * // 1 second pause complete
 * ```
 */
export async function waitFixed(ms: number): Promise<void> {
  await wait(ms);
}

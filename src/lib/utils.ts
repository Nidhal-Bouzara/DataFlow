import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Node } from "@xyflow/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUniqueId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${randomStr}`;
}

interface NodeDimensions {
  width: number;
  height: number;
}

/**
 * Find a non-overlapping position for a new node by checking against existing nodes
 * and pushing the position if needed
 */
export function findNonOverlappingPosition(
  nodes: Node[],
  initialPosition: { x: number; y: number },
  dimensions: NodeDimensions = { width: 300, height: 150 }
): { x: number; y: number } {
  const margin = 20; // Minimum space between nodes
  const maxAttempts = 50;

  const position = { ...initialPosition };
  let attempt = 0;

  const checkOverlap = (pos: { x: number; y: number }) => {
    return nodes.some((node) => {
      const nodeWidth = node.width || 300;
      const nodeHeight = node.height || 150;

      const overlapX = pos.x < node.position.x + nodeWidth + margin && pos.x + dimensions.width + margin > node.position.x;

      const overlapY = pos.y < node.position.y + nodeHeight + margin && pos.y + dimensions.height + margin > node.position.y;

      return overlapX && overlapY;
    });
  };

  // Try different positions in a spiral pattern
  while (checkOverlap(position) && attempt < maxAttempts) {
    attempt++;

    // Spiral outward: right, down, left, up with increasing distances
    const spiralRadius = Math.floor(attempt / 4) + 1;
    const direction = attempt % 4;
    const offset = (dimensions.height + margin) * spiralRadius;

    switch (direction) {
      case 0: // Right
        position.x = initialPosition.x + offset;
        position.y = initialPosition.y;
        break;
      case 1: // Down
        position.x = initialPosition.x;
        position.y = initialPosition.y + offset;
        break;
      case 2: // Left
        position.x = initialPosition.x - offset;
        position.y = initialPosition.y;
        break;
      case 3: // Up
        position.x = initialPosition.x;
        position.y = initialPosition.y - offset;
        break;
    }
  }

  return position;
}

/**
 * Resolve collisions by pushing overlapping nodes away from each other
 */
export function resolveNodeCollisions<T extends Node>(
  nodes: T[],
  options: {
    margin?: number;
    maxIterations?: number;
  } = {}
): T[] {
  const { margin = 20, maxIterations = 10 } = options;
  const updatedNodes = nodes.map((node) => ({ ...node }));

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let hasCollision = false;

    for (let i = 0; i < updatedNodes.length; i++) {
      for (let j = i + 1; j < updatedNodes.length; j++) {
        const nodeA = updatedNodes[i];
        const nodeB = updatedNodes[j];

        const widthA = nodeA.width || 300;
        const heightA = nodeA.height || 150;
        const widthB = nodeB.width || 300;
        const heightB = nodeB.height || 150;

        const overlapX = nodeA.position.x < nodeB.position.x + widthB + margin && nodeA.position.x + widthA + margin > nodeB.position.x;

        const overlapY = nodeA.position.y < nodeB.position.y + heightB + margin && nodeA.position.y + heightA + margin > nodeB.position.y;

        if (overlapX && overlapY) {
          hasCollision = true;

          // Calculate center points
          const centerAX = nodeA.position.x + widthA / 2;
          const centerAY = nodeA.position.y + heightA / 2;
          const centerBX = nodeB.position.x + widthB / 2;
          const centerBY = nodeB.position.y + heightB / 2;

          // Calculate push direction
          const dx = centerBX - centerAX;
          const dy = centerBY - centerAY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0) {
            // Push both nodes apart
            const pushDistance = (margin + 10) / 2;
            const pushX = (dx / distance) * pushDistance;
            const pushY = (dy / distance) * pushDistance;

            updatedNodes[i] = {
              ...nodeA,
              position: {
                x: nodeA.position.x - pushX,
                y: nodeA.position.y - pushY,
              },
            };

            updatedNodes[j] = {
              ...nodeB,
              position: {
                x: nodeB.position.x + pushX,
                y: nodeB.position.y + pushY,
              },
            };
          }
        }
      }
    }

    if (!hasCollision) break;
  }

  return updatedNodes;
}

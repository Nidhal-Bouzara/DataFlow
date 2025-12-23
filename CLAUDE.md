# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a visual workflow builder for data processing pipelines, built with Next.js 16, React 19, and React Flow. The application provides a canvas-based interface where users can drag and drop nodes to create data processing workflows.

## Key Technologies

- **Next.js 16** with App Router and React Compiler enabled
- **React 19** (client-side components)
- **@xyflow/react** (formerly React Flow) for the workflow canvas
- **Zustand** for state management
- **Tailwind CSS v4** with PostCSS
- **TypeScript** with strict mode enabled

## Development Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
# or just
eslint
```

## Architecture Overview

### State Management (Zustand Store)

The entire workflow state is managed through `src/store/workflowStore.ts`:

- **Nodes**: Array of workflow nodes (assets, actions, conditions, etc.)
- **Edges**: Array of connections between nodes
- **Selected Node**: Currently selected node ID
- Store provides actions for: adding/removing nodes, connecting nodes, updating node data

The store uses React Flow's `applyNodeChanges` and `applyEdgeChanges` for reactive updates.

### Core Node System

Workflow nodes are defined with these key types in `workflowStore.ts`:

- `asset` - Single file/data source nodes
- `assetStack` - Multiple file nodes (stacked representation)
- `action` - Data processing actions
- `condition` - Branching logic
- `pdfExtract` - PDF text extraction

Each node type has default properties defined in `nodeDefaults` including label, description, colors, and badge styling.

### Component Architecture

**Three-Panel Layout** (`src/app/page.tsx`):
- `LeftPanel`: Tool palette with draggable node types
- `WorkflowCanvas`: Central React Flow canvas
- `RightPanel`: Node properties/settings

**Node Components** (`src/components/nodes/`):
- `BaseNode.tsx`: Shared node UI with drag handles, badges, and connection points
- Specialized nodes extend BaseNode (AssetNode, ActionNode, ConditionNode, etc.)
- Node registry in `index.tsx` maps node types to components
- Handles (connection points) visibility is controlled by hover and connection state

**Sidebar Framework** (`src/components/sidebar/framework/`):
- Generic collapsible section system
- Supports three item types: `tool` (draggable node), `component` (custom React component), `group` (nested items)
- Tool sections defined in `src/components/sidebar/toolSections.tsx`

### Canvas System

`src/components/canvas/WorkflowCanvas.tsx`:
- React Flow instance with strict connection mode
- Drag-and-drop support for adding nodes from sidebar
- Node collision detection and automatic position adjustment on drag stop
- Custom edge type (`dataFlow`) for connections
- MiniMap and Controls for navigation

### Collision Detection

`src/lib/utils.ts` contains two collision systems:

1. **`findNonOverlappingPosition`**: Used when adding new nodes - spirals outward to find free space
2. **`resolveNodeCollisions`**: Used after drag operations - iteratively pushes overlapping nodes apart

Both use configurable margins and work with variable node dimensions.

### Drag and Drop Flow

1. User drags a tool item from sidebar (sets `application/reactflow` data with node type)
2. Canvas `onDrop` handler reads drag data
3. `screenToFlowPosition` converts screen coordinates to canvas coordinates
4. `addNode` action adds node to store with collision-free position

### Edge Connection

- Connection mode is set to `Strict` - edges must connect from source handle to target handle
- Custom `dataFlow` edge type defined in `src/components/edges/DataFlowEdge.tsx`
- Edges are reconnectable with 30px radius
- Connection line preview shows orange dashed line during drag

## File Organization

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx           # Main layout (3-panel)
│   └── layout.tsx         # Root layout
├── components/
│   ├── canvas/            # React Flow canvas wrapper
│   ├── nodes/             # All node type components
│   ├── edges/             # Custom edge components
│   ├── sidebar/           # Left/right panels + framework
│   │   ├── framework/     # Generic collapsible section system
│   │   ├── features/      # Specific features (file upload, actions)
│   │   └── toolSections.tsx  # Tool definitions
│   ├── toolbar/           # Bottom toolbar
│   └── ui/                # Reusable UI components
├── store/                 # Zustand stores
│   └── workflowStore.ts   # Main workflow state
└── lib/
    └── utils.ts           # Utilities (cn, collision detection, ID generation)
```

## Adding New Node Types

To add a new node type:

1. Add the type to `NodeType` union in `workflowStore.ts`
2. Add default properties to `nodeDefaults` object
3. Create node component in `src/components/nodes/` (extend BaseNode or create custom)
4. Register in `nodeTypes` object in `src/components/nodes/index.tsx`
5. Add to sidebar in `src/components/sidebar/toolSections.tsx`

## Key Patterns

- **Client Components**: All interactive components use `"use client"` directive (Next.js App Router requirement)
- **Tailwind Styling**: Use `cn()` utility from `lib/utils.ts` to merge Tailwind classes
- **Handle Visibility**: Node handles appear on hover or when connected (see BaseNode implementation)
- **Path Alias**: `@/` maps to `src/` directory
- **React Flow Providers**: Canvas must be wrapped in `ReactFlowProvider` for hooks to work

## Important Configuration

- **React Compiler**: Enabled in `next.config.ts` for automatic optimization
- **Tailwind v4**: Uses PostCSS plugin (`@tailwindcss/postcss`)
- **ESLint**: Uses Next.js recommended config with custom global ignores
- **TypeScript**: JSX set to `react-jsx` (React 17+ transform)

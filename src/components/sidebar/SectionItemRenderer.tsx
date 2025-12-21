import { SectionItem } from "./types";
import { ToolItemComponent } from "./ToolItemComponent";

interface SectionItemRendererProps {
  item: SectionItem;
}

/**
 * Renders different types of section items based on their discriminated type
 * Acts as a dispatcher to route items to the appropriate renderer
 */
export function SectionItemRenderer({ item }: SectionItemRendererProps) {
  switch (item.type) {
    case "tool":
      return <ToolItemComponent item={item.data} />;

    case "component": {
      const Component = item.component;
      return <Component {...(item.props || {})} />;
    }

    case "group":
      return (
        <div className="pl-2">
          {item.label && <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</div>}
          {item.items.map((subItem, idx) => (
            <SectionItemRenderer key={idx} item={subItem} />
          ))}
        </div>
      );

    default:
      // TypeScript exhaustiveness check
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustive: never = item;
      return null;
  }
}

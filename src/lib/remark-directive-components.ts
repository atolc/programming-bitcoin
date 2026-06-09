import { visit } from "unist-util-visit";

type DirectiveNode = {
  type: string;
  name: string;
  children?: { type: string; value?: string; children?: { value?: string }[] }[];
  data?: { hName?: string; hProperties?: Record<string, string> };
};

export function remarkDirectiveComponents() {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, (node) => {
      if (
        node.type !== "containerDirective" &&
        node.type !== "leafDirective" &&
        node.type !== "textDirective"
      ) {
        return;
      }

      const directive = node as unknown as DirectiveNode;

      if (directive.name === "details") {
        const data = directive.data || (directive.data = {});
        data.hName = "collapsible";
        const titleNode = directive.children?.[0];
        const title =
          titleNode?.type === "paragraph" &&
          titleNode.children?.[0] &&
          typeof titleNode.children[0].value === "string"
            ? titleNode.children[0].value
            : "Detalles";
        data.hProperties = { title };
        if (directive.children && directive.children.length > 0) {
          directive.children = directive.children.slice(1);
        }
      }
    });
  };
}

/**
 * remark plugin: MDX from the database may use Markdown and a few harmless inline tags, nothing else.
 *
 * The `components` map only applies to elements produced by Markdown syntax; literal JSX such as
 * `<script>` or `<iframe>` in the source bypasses it. This removes every JSX element that is not
 * allowlisted (attributes are stripped except `title`) and any import/export statements.
 * JavaScript expressions are already removed by next-mdx-remote's `blockJS`.
 */

type MdNode = {
  type: string;
  name?: string | null;
  children?: MdNode[];
  attributes?: { type: string; name?: string }[];
};

const SAFE_TAGS = new Set([
  "br",
  "sub",
  "sup",
  "kbd",
  "mark",
  "abbr",
  "u",
  "s",
  "details",
  "summary",
]);

function isJsx(node: MdNode) {
  return node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
}

function clean(node: MdNode) {
  if (!node.children) return;
  node.children = node.children.filter((child) => {
    if (child.type === "mdxjsEsm") return false;
    if (isJsx(child)) {
      if (!child.name || !SAFE_TAGS.has(child.name)) return false;
      child.attributes = (child.attributes ?? []).filter(
        (attribute) => attribute.type === "mdxJsxAttribute" && attribute.name === "title",
      );
    }
    return true;
  });
  node.children.forEach(clean);
}

export function remarkSafeJsx() {
  return (tree: MdNode) => clean(tree);
}

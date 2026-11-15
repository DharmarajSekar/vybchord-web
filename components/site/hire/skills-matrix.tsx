import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Role } from "@/content/hire-engineers";

/** FR-P6 skills matrix: a table from tablet width up, stacked role cards on phones. */
export function SkillsMatrix({ roles }: { roles: Role[] }) {
  return (
    <>
      <div className="hidden rounded-xl ring-1 ring-foreground/10 md:block">
        <Table>
          <TableCaption className="sr-only">Core skills and tools by role</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" className="px-4">
                Role
              </TableHead>
              <TableHead scope="col" className="px-4">
                Core skills
              </TableHead>
              <TableHead scope="col" className="px-4">
                Also works with
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.slug}>
                <TableHead scope="row" className="px-4 font-medium text-foreground">
                  {role.title}
                </TableHead>
                <TableCell className="px-4 whitespace-normal">{role.core.join(", ")}</TableCell>
                <TableCell className="px-4 whitespace-normal text-muted-foreground">
                  {role.tools.join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="space-y-4 md:hidden">
        {roles.map((role) => (
          <li key={role.slug} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <h3 className="font-semibold">{role.title}</h3>
            <dl className="mt-2 space-y-1 text-sm">
              <div>
                <dt className="inline font-medium">Core skills: </dt>
                <dd className="inline">{role.core.join(", ")}</dd>
              </div>
              <div className="text-muted-foreground">
                <dt className="inline font-medium">Also works with: </dt>
                <dd className="inline">{role.tools.join(", ")}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

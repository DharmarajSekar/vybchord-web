import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Card = { title: string; description: string };

/** Grid of simple title + description cards (engagement models, work modes, …). */
export function InfoCards({ cards, columns = 3 }: { cards: Card[]; columns?: 2 | 3 | 4 }) {
  return (
    <ul
      className={cn(
        "grid gap-6 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
      )}
    >
      {cards.map((card) => (
        <li key={card.title} className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <h3 className="font-semibold">{card.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
        </li>
      ))}
    </ul>
  );
}

/** Bulleted list with check marks. */
export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

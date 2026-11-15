import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/site/section";
import type { ProductFaq } from "@/lib/data/products";

/** FR-P3 FAQs accordion. */
export function ProductFaqs({ faqs }: { faqs: ProductFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <Section id="faqs" eyebrow="FAQs" title="Common questions" className="bg-muted/40">
      <Accordion className="max-w-3xl">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-line text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

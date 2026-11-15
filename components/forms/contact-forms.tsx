"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contactTopics, type Option } from "@/lib/validations/options";
import { ContactForm } from "./contact-form";
import { DemoForm } from "./demo-form";
import { ProjectForm } from "./project-form";
import { StaffingForm } from "./staffing-form";

type Topic = (typeof contactTopics)[number]["value"];

const intro: Record<Topic, string> = {
  product:
    "Book a demo or ask about licensing, white-label or IP transfer. We reply within one business day.",
  project:
    "Tell us what you want to build. We reply within one business day to set up a discovery call.",
  staffing: "Tell us who you need. You get matching engineer profiles within 48 hours.",
  careers:
    "To apply for a role, use the form on the job page. For other careers questions, write to us here.",
  other: "Questions, partnerships or anything else. We reply within one business day.",
};

/**
 * FR-P11 topic routing: the selected topic shows the matching form (F1, F2, F3 or F5).
 * Links such as /contact?topic=product&product=vaulthrms&interest=licence preselect fields.
 */
export function ContactForms({ products }: { products: Option[] }) {
  const params = useSearchParams();
  const fromUrl = params.get("topic");
  const [topic, setTopic] = useState<Topic>(
    contactTopics.some((t) => t.value === fromUrl) ? (fromUrl as Topic) : "product",
  );

  return (
    <Tabs value={topic} onValueChange={(value) => setTopic(value as Topic)}>
      <p id="topic-label" className="mb-3 text-sm font-medium">
        What can we help with?
      </p>
      <TabsList aria-labelledby="topic-label" className="h-auto w-full flex-wrap justify-start">
        {contactTopics.map((option) => (
          <TabsTrigger key={option.value} value={option.value} className="flex-none px-3 py-1.5">
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {contactTopics.map(({ value }) => (
        <TabsContent key={value} value={value} className="pt-6">
          <p className="mb-6 text-muted-foreground">{intro[value]}</p>
          {value === "product" &&
            (products.length > 0 ? (
              <DemoForm
                products={products}
                defaultProduct={params.get("product") ?? undefined}
                defaultInterest={params.get("interest") ?? undefined}
              />
            ) : (
              <ContactForm topic="other" />
            ))}
          {value === "project" && (
            <ProjectForm defaultService={params.get("service") ?? undefined} />
          )}
          {value === "staffing" && <StaffingForm defaultRole={params.get("role") ?? undefined} />}
          {value === "careers" && (
            <>
              <p className="mb-6">
                <Link href="/careers" className="font-medium underline underline-offset-4">
                  See open roles
                </Link>
              </p>
              <ContactForm topic="careers" />
            </>
          )}
          {value === "other" && <ContactForm topic="other" />}
        </TabsContent>
      ))}
    </Tabs>
  );
}

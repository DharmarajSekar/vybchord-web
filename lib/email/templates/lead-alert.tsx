import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, text } from "./layout";

export type EmailField = { label: string; value: string };

/** Founder alert for a new lead or application (tech spec §4 step 7). */
export function LeadAlertEmail({
  title,
  fields,
  adminUrl,
}: {
  title: string;
  fields: EmailField[];
  adminUrl: string | null;
}) {
  return (
    <EmailLayout preview={title}>
      <Heading as="h1" style={text.heading}>
        {title}
      </Heading>
      {fields.map((field) => (
        <div key={field.label}>
          <Text style={text.label}>{field.label}</Text>
          <Text style={text.value}>{field.value}</Text>
        </div>
      ))}
      {adminUrl && (
        <Button href={adminUrl} style={text.button}>
          Open in admin
        </Button>
      )}
    </EmailLayout>
  );
}

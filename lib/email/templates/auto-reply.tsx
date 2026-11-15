import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, text } from "./layout";

export type AutoReplyContent = {
  subject: string;
  heading: string;
  paragraphs: string[];
  cta?: { label: string; href: string };
};

/** Visitor auto-reply with the FRD §4 promise for each form. */
export function AutoReplyEmail({
  name,
  content,
  footer,
}: {
  name?: string;
  content: AutoReplyContent;
  footer?: string | null;
}) {
  return (
    <EmailLayout preview={content.heading} footer={footer}>
      <Heading as="h1" style={text.heading}>
        {content.heading}
      </Heading>
      {name && <Text style={text.body}>Hi {name.split(" ")[0]},</Text>}
      {content.paragraphs.map((paragraph) => (
        <Text key={paragraph} style={text.body}>
          {paragraph}
        </Text>
      ))}
      {content.cta && (
        <Button href={content.cta.href} style={{ ...text.button, marginTop: "8px" }}>
          {content.cta.label}
        </Button>
      )}
    </EmailLayout>
  );
}

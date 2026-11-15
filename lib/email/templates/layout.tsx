import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

const styles = {
  body: { backgroundColor: "#f5f5f5", fontFamily: "Arial, Helvetica, sans-serif", margin: 0 },
  container: {
    backgroundColor: "#ffffff",
    margin: "24px auto",
    maxWidth: "560px",
    padding: "32px",
  },
  footer: { color: "#737373", fontSize: "12px", lineHeight: "18px", margin: 0 },
};

/** Shared email shell. `footer` is the legal name from site_settings. */
export function EmailLayout({
  preview,
  footer,
  children,
}: {
  preview: string;
  footer?: string | null;
  children: ReactNode;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>{children}</Section>
          {footer && (
            <>
              <Hr style={{ borderColor: "#e5e5e5", margin: "32px 0 16px" }} />
              <Text style={styles.footer}>{footer}</Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

export const text = {
  heading: {
    color: "#171717",
    fontSize: "22px",
    fontWeight: 600,
    lineHeight: "30px",
    margin: "0 0 16px",
  },
  body: { color: "#404040", fontSize: "15px", lineHeight: "24px", margin: "0 0 14px" },
  label: { color: "#737373", fontSize: "12px", margin: "0", textTransform: "uppercase" as const },
  value: {
    color: "#171717",
    fontSize: "15px",
    lineHeight: "22px",
    margin: "2px 0 14px",
    whiteSpace: "pre-line" as const,
  },
  button: {
    backgroundColor: "#171717",
    borderRadius: "8px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 600,
    padding: "12px 20px",
    textDecoration: "none",
  },
};

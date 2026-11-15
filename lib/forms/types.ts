/** Returned by a form server action when the submission is rejected. Success redirects instead. */
export type ActionResult = {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type FormKey = "demo" | "project" | "staffing" | "application" | "contact" | "newsletter";

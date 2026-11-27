import type { SVGProps } from "react";

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.25" />
      <path d="m2.5 4.25 5.5 4.25 5.5-4.25" />
    </svg>
  );
}

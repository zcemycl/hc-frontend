import { AETableAnnotationProvider } from "@/contexts";

export default function AnnotationAELayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AETableAnnotationProvider>{children}</AETableAnnotationProvider>;
}

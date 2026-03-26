import { AnalyzerWorkspace } from "@/components/analyzer/analyzer-workspace";

export default async function AnalyzerPage({
  searchParams,
}: {
  searchParams: Promise<{ emails?: string; context?: string; range?: string }>;
}) {
  const params = await searchParams;

  return (
    <AnalyzerWorkspace
      initialEmailIds={params.emails?.split(",").filter(Boolean)}
      contextLabel={params.context}
      rangeLabel={params.range}
    />
  );
}

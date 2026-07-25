interface Props {
  error: unknown;
}

function chain(error: unknown): string[] {
  const lines: string[] = [];
  let current = error;
  while (current instanceof Error) {
    lines.push(`${current.name}: ${current.message}`);
    current = current.cause;
  }
  if (lines.length === 0 && current != null) lines.push(String(current));
  return lines;
}

export function RawError({ error }: Props) {
  if (!error) return null;

  return (
    <pre className="max-w-full overflow-x-auto whitespace-pre-wrap rounded-md border border-destructive bg-muted p-4 text-destructive text-xs">
      {chain(error).join("\n\n")}
    </pre>
  );
}

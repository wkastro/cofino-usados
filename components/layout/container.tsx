import { cn } from "@/lib/utils";

function Container({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export { Container };

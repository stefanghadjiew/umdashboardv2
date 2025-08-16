import { cn } from "./lib/utils";
import { Form } from "./form";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6 w-[100%]", className)} {...props}>
      <Form />
    </div>
  )
}

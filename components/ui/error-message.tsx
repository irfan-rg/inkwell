import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorMessage({
  title = "Error",
  message,
  retry,
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{message}</p>
        {retry && (
          <Button
            variant="outline"
            size="sm"
            onClick={retry}
            className="bg-background hover:bg-background/80"
          >
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

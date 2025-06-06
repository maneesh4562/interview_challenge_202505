import { Link, useFetcher } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Note } from "~/db/schema";
import { formatRelativeTime } from "~/utils/date";
import { Button } from "~/components/ui/button";
import { StarIcon } from "@radix-ui/react-icons";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NoteCardProps {
  note: SerializedNote;
}

export function NoteCard({ note }: NoteCardProps) {
  const fetcher = useFetcher();
  const isFavorite = note.favorite;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-none">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 flex-1">
            <Link to={`/notes/${note.id}`} className="hover:underline">
              {note.title}
            </Link>
          </CardTitle>
          <fetcher.Form method="post" action={`/api/notes/${note.id}/favorite`}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className={isFavorite ? "text-yellow-500" : "text-muted-foreground"}
            >
              <StarIcon className="h-4 w-4" />
            </Button>
          </fetcher.Form>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {note.description || ""}
        </p>
      </CardContent>
      <CardFooter className="flex-none border-t pt-4">
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(note.createdAt)}
        </p>
      </CardFooter>
    </Card>
  );
}

"use client";

import Link from "next/link";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[90svh] flex-col items-center justify-center text-center">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          Seite nicht gefunden
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Die gesuchte Seite existiert nicht oder wurde verschoben. Bitte kehren
          Sie zur Startseite zurück.
        </p>
        <Button asChild>
          <Link href="/">Zurück zur Startseite</Link>
        </Button>
      </div>
    </Container>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

import type { PublicUserT } from "@/lib/dal";
import { createSupportTicket } from "@/services/server/actions/create-support-ticket";

export default function ProblemForm({
  user,
  userEmail,
}: {
  user: PublicUserT;
  userEmail: string | undefined;
}) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateSupportTicket() {
    setIsSubmitting(true);
    try {
      const aiResponse = await fetch(
        "/api/chatgpt-assistants/create-support-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const result = await aiResponse.json();

      // Prüfe ob die API einen Fehler zurückgegeben hat
      if (result) {
        console.warn(
          "ChatGPT API error, creating ticket with original message:",
          result.error
        );

        // Fallback: Erstelle Ticket mit ursprünglicher Nachricht
        const ticketResult = await createSupportTicket({
          message: message, // Verwende die ursprüngliche Nachricht
          user,
          userEmail: userEmail || "",
          priority: "normal", // Standard-Priorität
          title: `Support: ${user.first_name} ${user.last_name}`,
          tags: ["ai-error", "manual-review"], // Tags für manuelle Überprüfung
        });

        if (ticketResult) {
          toast.success(
            "Support-Ticket erstellt (AI-Fehler - wird manuell überprüft)"
          );
          setMessage("");
        } else {
          throw new Error("Failed to create fallback ticket");
        }
        return;
      }

      const { message: assistantMessage, priority, title, tags } = result;

      // Stelle sicher, dass wir ein Array für Tags haben
      const tagsArray = Array.isArray(tags) ? tags : [];
      // Erstelle das Support-Ticket mit den Details
      const ticketResult = await createSupportTicket({
        message: assistantMessage,
        user,
        userEmail: userEmail || "",
        priority,
        title,
        tags: tagsArray,
      });

      if (ticketResult) {
        toast.success("Support-Ticket erfolgreich erstellt!");
        setMessage(""); // initialize Textarea after successful ticket creation
      } else {
        console.error("Error creating support ticket:", ticketResult);
        toast.error(
          "Fehler beim Erstellen des Support-Tickets. Bitte versuche es später erneut oder sende uns eine E-Mail an kontakt@resqx.de"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Fehler beim Erstellen des Support-Tickets. Bitte versuche es später erneut oder sende uns eine E-Mail an kontakt@resqx.de"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mt-6 mb-6 sm:mb-10">
        Hast du ein Problem, einen Vorschlag oder bereits eine Lösung? Teile es
        uns gerne mit – wir möchten wissen, wie wir dein Nutzererlebnis weiter
        optimieren können!
      </div>

      <Textarea
        placeholder="Deine Nachricht..."
        rows={7}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="mt-6 flex w-full justify-start max-md:w-full sm:mt-10">
        <Button
          onClick={handleCreateSupportTicket}
          disabled={isSubmitting || !message.trim()}
          className="flex-0"
        >
          {isSubmitting ? "Wird erstellt..." : "Absenden"}
        </Button>
      </div>
    </div>
  );
}

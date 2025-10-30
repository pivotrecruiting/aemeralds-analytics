"use server";
import { getTranslatedRole } from "@/utils/helpers/get-translated-role";
import type { PublicUserT } from "@/lib/dal";

export async function createSupportTicket({
  message,
  user,
  userEmail,
  priority,
  title,
  tags,
}: {
  message: string;
  user: PublicUserT;
  userEmail: string | null;
  priority: string;
  title: string;
  tags: string[];
}) {
  try {
    const ticketName = title || `Support: ${user.first_name} ${user.last_name}`;

    const description = `## Nachricht
    ${message}

    ## Benutzerdetails
    - Rolle: ${getTranslatedRole(user.user_roles[0].roles.name) || "N/A"}
    - Name: ${user.first_name || "N/A"} ${user.last_name || "N/A"}
    - E-Mail: ${userEmail || "N/A"}
    `;

    // Mapping der Prioritätswerte auf ClickUp Prioritäten (1 = höchste)
    const priorityMap: Record<string, number> = {
      dringend: 1,
      hoch: 2,
      normal: 3,
      niedrig: 4,
    };

    const clickupPriority = priorityMap[priority?.toLowerCase()] || 3;

    const endpoint = `https://api.clickup.com/api/v2/list/${process.env.CLICKUP_LIST_ID}/task`;

    const requestBody = {
      name: ticketName,
      description: description,
      status: "to do",
      priority: clickupPriority,
      tags: tags,
      notify_all: false,
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.CLICKUP_API_KEY || "",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ClickUp API error:", errorData);
      throw new Error(`ClickUp API error: ${response.status}`);
    }

    await response.json();

    return true;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return null;
  }
}

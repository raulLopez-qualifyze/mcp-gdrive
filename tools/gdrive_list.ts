import { google } from "googleapis";
import { GDriveListInput, InternalToolResponse } from "./types.js";

// Qualifyze fork: upstream has no way to enumerate shared drives or browse one.
// gdrive_search only does `name contains`. This tool fills that gap:
//   no driveId  -> list the shared drives the user can see
//   driveId set -> list files in that shared drive
export const schema = {
  name: "gdrive_list",
  description:
    "List shared drives, or list files inside a specific shared drive. " +
    "Call with no arguments to get shared drives (their ids and names). " +
    "Pass driveId to browse the files in that shared drive.",
  inputSchema: {
    type: "object",
    properties: {
      driveId: {
        type: "string",
        description:
          "Shared drive id to list files from. Omit to list the shared drives themselves.",
      },
      pageToken: {
        type: "string",
        description: "Token for the next page of results",
      },
      pageSize: {
        type: "number",
        description: "Number of results per page (max 100)",
      },
    },
    required: [],
  },
} as const;

export async function list(
  args: GDriveListInput,
): Promise<InternalToolResponse> {
  const drive = google.drive("v3");

  // No driveId: enumerate the shared drives.
  if (!args.driveId) {
    const res = await drive.drives.list({
      pageSize: args.pageSize || 100,
      pageToken: args.pageToken,
      fields: "nextPageToken, drives(id, name)",
    });
    const drives = res.data.drives ?? [];
    const lines = drives.map((d) => `${d.id} ${d.name}`).join("\n");
    let text = `Found ${drives.length} shared drives:\n${lines}`;
    if (res.data.nextPageToken)
      text += `\n\nMore results available. Use pageToken: ${res.data.nextPageToken}`;
    return { content: [{ type: "text", text }], isError: false };
  }

  // driveId given: list files scoped to that shared drive.
  const res = await drive.files.list({
    corpora: "drive",
    driveId: args.driveId,
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    q: "trashed = false",
    pageSize: args.pageSize || 20,
    pageToken: args.pageToken,
    orderBy: "modifiedTime desc",
    fields: "nextPageToken, files(id, name, mimeType, modifiedTime, size)",
  });
  const files = res.data.files ?? [];
  const lines = files
    .map((f) => `${f.id} ${f.name} (${f.mimeType})`)
    .join("\n");
  let text = `Found ${files.length} files in drive ${args.driveId}:\n${lines}`;
  if (res.data.nextPageToken)
    text += `\n\nMore results available. Use pageToken: ${res.data.nextPageToken}`;
  return { content: [{ type: "text", text }], isError: false };
}

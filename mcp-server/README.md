# Codefest MCP Server

Gives your AI assistant (Claude Desktop, Cursor, Windsurf, or any MCP-compatible client) direct access to the [Codefest.ai](https://codefest.ai) curated hackathon component library.

Instead of getting generic "here are some options" answers, your AI can query real structured data — setup times, difficulty ratings, compatibility notes, curated docs — and generate personalized context packs for your specific project.

**Works offline.** All 58 components are embedded in the package. No API calls, no auth, no rate limits.

---

## Tools

| Tool | What it does |
|------|-------------|
| `codefest_search_components` | Search by keyword, category, difficulty |
| `codefest_get_component` | Full details for one component |
| `codefest_list_categories` | All categories with counts |
| `codefest_recommend_stack` | Recommended stack for map/form/ai/data/realtime/alerts |
| `codefest_generate_context` | Generate a personalized AI context pack (.md) |

---

## Install

### 1. Build

```bash
cd mcp-server
npm install
npm run build
```

### 2. Add to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "codefest": {
      "command": "node",
      "args": ["/absolute/path/to/codefest/mcp-server/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop. You'll see "codefest" in the MCP tools panel.

### 3. Add to Cursor

In Cursor settings → MCP → Add server:
- **Name:** codefest
- **Command:** `node /absolute/path/to/codefest/mcp-server/dist/index.js`

---

## Example prompts

Once installed, try these in Claude Desktop or Cursor:

- *"Search the Codefest library for auth components under 20 minutes to set up"*
- *"Get full details on Supabase Auth"*
- *"What stack should I use for a health equity app that shows data on a map?"*
- *"Generate a context pack for my hackathon: I'm building a food access tool for a 24h event with 3 people"*

---

## Development

```bash
npm run dev    # watch mode with tsx
npm run build  # compile to dist/
npm start      # run compiled server
```

Test with MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

---

*Part of [Codefest.ai](https://codefest.ai) — the participant-first hackathon infrastructure layer*

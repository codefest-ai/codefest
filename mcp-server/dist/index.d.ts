#!/usr/bin/env node
/**
 * Codefest MCP Server
 *
 * Gives your AI assistant (Claude Desktop, Cursor, Windsurf, etc.) direct access
 * to the Codefest.ai curated hackathon component library — so you get
 * hackathon-aware recommendations instead of generic answers.
 *
 * Tools:
 *   codefest_search_components   — search by keyword, category, difficulty
 *   codefest_get_component       — full details for one component
 *   codefest_list_categories     — all categories with counts
 *   codefest_recommend_stack     — recommended stack for a given problem type
 *   codefest_generate_context    — generate a personalized AI context pack (.md)
 *
 * Install in Claude Desktop:
 *   Add to ~/Library/Application Support/Claude/claude_desktop_config.json:
 *   {
 *     "mcpServers": {
 *       "codefest": {
 *         "command": "node",
 *         "args": ["/path/to/codefest/mcp-server/dist/index.js"]
 *       }
 *     }
 *   }
 */
export {};

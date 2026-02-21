# Lessons Learned: Product Build
## EquityBridge Grant Discovery Platform — IST 601 Final Project

## Development Process

The EquityBridge Custom GPT was developed through an iterative co-design process using Claude Opus 4.5 as a recursive design partner. Rather than writing instructions in isolation and testing afterward, development occurred through continuous dialogue — drafting instructions, analyzing test outputs together, identifying failure patterns, and refining in real-time. The full testing and refinement cycle documented here occurred in a single afternoon session (November 30, 2025).

## Technical Stack

- **Backend:** FastAPI deployed on Railway, SQLite database expanded from 25 to 178 grants via bulk generation script
- **Frontend:** HTML/CSS/JS deployed on Vercel
- **Conversational AI:** OpenAI Custom GPT with web browsing and DALL-E capabilities, connected to backend API via GPT Actions
- **Knowledge base:** matching criteria, 8-stage grant lifecycle, and 6 user personas

## Testing & Refinement Methodology

### Practitioner Validation

Test scenarios used real nonprofits the developer had direct professional experience with (DESI SoCal, Sahaba Initiative). This domain expertise enabled validation beyond surface-level testing — verifying whether web lookups returned accurate organizational data, whether grant matches aligned with actual organizational capacity and mission, and catching when the GPT made incorrect assumptions. Testing with familiar organizations meant knowing what 'right' looked like.

### Critical Lens Protocol

Conversations were conducted with deliberate friction — giving short answers, expressing uncertainty ('maybe', 'not sure'), and pushing back on unnecessary steps. This stress-tested whether the GPT would collaborate or steamroll past user preferences.

### Recursive Analysis

Full conversation transcripts were analyzed with Claude Opus 4.5 to identify specific failure points: walls of text, stacked questions, repeated permission-asking, and missed opportunities for user-driven ideation. Fixes were drafted collaboratively and tested immediately.

## Iteration Progression

**v1 (Original):** Followed team's persona framework. Warm tone but no guardrails on response length or automation behavior. GPT produced walls of text, automated through user's 'ok' responses without checking what they actually wanted.

**v2:** Added response length limits (2-4 sentences) and pause points after presenting matches. Overcorrected — GPT became too hesitant, asking permission for basic web research it should just do.

**v3 (Final):** Balanced smart inference (research without asking) with collaborative pauses (after presenting options). Produced successful demo: user-driven ideation led to co-created 'Healthy Homes, Connected Communities' project concept, Grant Match Card, and Sustainability Note — all emerging from genuine dialogue rather than automation.

**v4 (Rejected):** Attempted stricter 'one question only' and 'ask permission once' rules. GPT got stuck in research rabbit holes, never delivered grant matches. Reverted to v3.

## Key Lessons

**1. Capability creep vs. design intent**
Adding web research and document creation made the GPT more powerful but less aligned with original 'warm, never overwhelming' goals. Features enabled the system to do more TO users rather than WITH them.

**2. Efficiency ≠ collaboration**
Early versions optimized for task completion. User kept saying 'ok' and GPT kept producing — missing opportunities to explore what user actually wanted.

**3. Pause points transform interaction**
One question — 'Do any of these connect to something you're already working on?' — shifted the tool from document-delivery to genuine co-creation.

**4. Balance inference with collaboration**
First fix overcorrected (asked permission for everything). Better balance: research aggressively, pause collaboratively after presenting options.

**5. Prompt engineering has limits**
Custom GPT instructions compete with base model defaults. Some behaviors resist instruction-level fixes; production systems may need code-level guardrails.

**6. Domain expertise enables validation**
Testing with organizations the developer had worked with professionally allowed verification of accuracy — not just whether the GPT responded, but whether it responded correctly.

---

*Evren Arat, Kauser Razvi, Samantha Aguirre*
*IST 601 — Claremont Graduate University*

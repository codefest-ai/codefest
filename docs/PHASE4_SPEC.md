# Codefest.ai — Phase 4 Spec
## Bounty Pools + Sponsorship + Crypto Infrastructure

*Drafted Feb 2026 — for implementation after Phase 2-3 traction*

---

## What Phase 4 Is

Phase 4 introduces real money into the platform. It requires user density (from Phase 2-3), legal review, and Shariah compliance confirmation before going live. The architecture should be designed for Phase 4 from Phase 2 onward — retrofitting payment rails is expensive.

The core model: skill competitions with prize pools, platform takes a service fee on settlement, prize funding comes from sponsors and/or participants, payout is transparent and auditable.

---

## The Two Tracks

### Track A — Official Codefest Events (Start Here)

**Structure:**
- Evren or verified sponsors fund the prize pool
- Participants enter for free (or pay an access/operational fee that does NOT go into the prize pool)
- Platform takes a cut of sponsorship revenue (not from participant fees)
- Prizes paid out to winners via Stripe or STX

**Why this first:**
- Zero legal complexity — promotional skill competition with third-party sponsor prize
- Clean Shariah structure — musabaqah (skill competition) with third-party prize donor, no participant wagering against each other
- Builds trust before asking participants to put their own money in
- Lets you run real events, prove the model, attract sponsor revenue
- No money transmitter license concerns — sponsor pays Codefest, Codefest pays winners (standard business transaction)

**Operational flow:**
```
Sponsor signs agreement → pays Codefest (Stripe invoice)
↓
Event created with prize pool displayed publicly
↓
Participants register (free or small access fee for operational costs)
↓
Judging completes → winners determined
↓
Codefest pays out winners via Stripe (fiat) or STX transfer
↓
Platform retains service fee (15-20% of sponsor contribution)
```

**Shariah note:** This is the cleanest possible structure. Sponsor payment is a marketing/services contract (halal exchange). Participant entry is free or pays for real services rendered (ujrah). Prize is third-party funded. No riba, no gharar, no maysir.

---

### Track B — Community Bounty Pools (Phase 4+)

**Structure:**
- Any user with 200+ CodePoints can create a bounty event
- Participants pay entry fee; fees pool into prize fund
- Platform takes 10-15% on settlement
- Payout via Clarity smart contract on Stacks blockchain OR fiat via Stripe

**Prerequisites before launching:**
1. 500+ active users on platform (need density for pools to fill)
2. Legal review of prize competition laws by state (see Legal section below)
3. Shariah scholar consultation on participant-funded pool structure
4. Smart contract audit if using Clarity track
5. Fiat escrow banking relationship OR smart contract deployment

**Why Stacks/Clarity for this:**
- Clarity is a decidable language — you can verify exactly what the contract does before any money enters
- Funds held in contract, not by Codefest → reduces money transmitter license risk
- Automatic payout on condition (judge scores submitted on-chain) → no discretion, no delay
- Transparent and auditable → builds participant trust
- Settles to Bitcoin → institutional credibility for academic/NGO partners
- No interest accrues in escrow → Shariah compliant

**Bounty pool smart contract flow:**
```
Creator deploys event contract (parameters: entry fee, max participants, judge addresses, payout split)
↓
Participants send STX to contract address (entry fee locked in contract)
↓
Event runs on Codefest platform
↓
Judges submit scores → contract verifies quorum of judge signatures
↓
Contract executes: pays winners per split, returns fee to platform wallet
↓
Platform wallet forwards service fee to ops account
```

---

## Sponsorship Model

### Who Sponsors Hackathons

For-profit companies sponsor developer events as a **marketing/advertising expense** — deductible, routes through marketing budget, no nonprofit status required.

**Why companies sponsor:**
- Brand visibility during active building (not a logo on a slide deck — their tool is in the component library developers have open for 48 hours)
- API/product usage and stress-testing at scale
- Talent pipeline access (see who built what, reach out directly)
- Association with ethical AI / impact hackathon culture

**The Codefest pitch to sponsors:**
> "Your API is open in front of 500 developers who are actively building, not browsing. We track which tools get used and how — you get post-event data on how participants integrated your product. No other platform has this because no other platform sits inside the build."

### Sponsor Tiers (Draft)

| Tier | Price | What They Get |
|------|-------|---------------|
| Tool Sponsor | $500/event | Component library featured placement, logo on event page |
| Track Sponsor | $2,000/event | Named track ("Best use of [Tool]"), prize contribution, participant data report |
| Presenting Sponsor | $5,000/event | Event co-branding, component library banner, sponsor workshop slot, full participant analytics, post-event showcase feature |
| Annual Partner | Custom | Multiple events, ongoing library placement, research data access |

### Shariah-Compliant Sponsor Selection

Codefest reserves the right to decline sponsorship from:
- Conventional interest-based banking and financial products
- Alcohol, tobacco, gambling, weapons industries
- Companies with predatory lending or exploitative data practices
- Any haram industry category (food/finance/entertainment review against Islamic guidelines)

**Framing externally:** "Ethically funded hackathons" — no need to lead with Shariah compliance in sponsor conversations, but the filter is applied consistently.

**For Islamic finance institutions and halal-focused companies:** these are natural alignment sponsors — Islamic fintech, halal food tech, ethical AI research labs, social impact funds.

---

## CodePoints and CodeCoin

### Phase 4: CodePoints Unlock Bounty Access

By Phase 4, CodePoints (non-transferable reputation, see Phase 2 spec) gate access to bounty events:
- Track A events (official, sponsor-funded): open to all registered users
- Track B events (community bounty pools): requires 200+ CodePoints
- High-stakes bounty events ($500+ prize pool): requires 500+ CodePoints + verified .edu or portfolio

This prevents farming and ensures prize pools attract serious participants.

### CodeCoin — Deferred, Not Abandoned

A transferable ecosystem token (CodeCoin or $CODE) is architecturally interesting but requires:
1. Securities law clarity — in the US, a transferable token with exchange value is potentially a security under the Howey test. Utility token exception exists but is contested.
2. Shariah scholar opinion — speculative tokens are gharar. Utility-only tokens with no speculative value are more defensible. A token that can only be used within Codefest (pay for featured placement, access event tiers, unlock workspace features) is closer to a loyalty point than a security.
3. Regulatory landscape — evolving rapidly. Worth monitoring but not worth building against an uncertain framework.

**Recommendation:** Keep CodePoints non-transferable through Phase 4. Revisit CodeCoin in 2027 when regulatory picture is clearer. Architecture should support token attachment to profiles (wallet address field, on-chain activity reference) without requiring it.

---

## Legal Landscape

### Skill Competition vs. Gambling

US legal test for gambling: requires Prize + Chance + Consideration (entry fee) simultaneously. Hackathons remove "Chance" — outcome is determined by judged skill, not randomness. This is the same argument fantasy sports companies made and largely won.

**Track A is unambiguously legal** — third-party prize, skill determination, no participant wagering.

**Track B requires:**
- Clear written judging criteria (skill, not chance)
- Verifiable judging process (multiple judges, documented scores)
- "No purchase necessary" alternative entry path in states that require it (mainly historical concern — check current state law)
- Official rules reviewed by a lawyer with contest/promotion experience
- Exclusion of residents of states where such competitions are prohibited (historically very few)

### Money Transmitter License (MTL)

If Codefest collects fees from participants and pays out prizes, some states classify this as money transmission requiring MTL.

**Mitigations:**
1. Smart contract approach (Track B via Clarity) — Codefest doesn't hold funds, the blockchain contract does. Codefest is a software facilitator. Legally unsettled but defensible.
2. Third-party payment processor as escrow holder — Stripe has MTL coverage in all US states. Structuring payouts through Stripe Connect may route around direct MTL requirements.
3. Legal opinion letter — get one before Track B goes live.

### Tax

- Prizes over $600 USD require IRS Form 1099-MISC to winners (US persons)
- Winners responsible for self-reporting internationally
- Platform retains service fee as ordinary revenue (standard)
- Sponsor payments are ordinary revenue to Codefest

---

## Architecture Requirements (Build Now, Use Later)

These should be in place by end of Phase 2 so Phase 4 doesn't require a rewrite:

**Database:**
```sql
-- Wallet addresses (optional, for crypto track)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  stacks_address text,
  ethereum_address text;

-- Sponsor agreements
CREATE TABLE sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_email text,
  tier text,
  shariah_vetted boolean DEFAULT false,
  contract_url text,
  created_at timestamptz DEFAULT now()
);

-- Event sponsorships (many-to-many)
CREATE TABLE event_sponsors (
  event_id uuid REFERENCES competitions(id),
  sponsor_id uuid REFERENCES sponsors(id),
  contribution_amount numeric,
  currency text DEFAULT 'USD',
  prize_contribution numeric DEFAULT 0,
  PRIMARY KEY (event_id, sponsor_id)
);

-- Prize pools
CREATE TABLE prize_pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES competitions(id),
  total_amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  funding_type text CHECK (funding_type IN ('sponsor','participant','mixed')),
  contract_address text, -- Stacks contract if using crypto track
  payout_status text DEFAULT 'pending' CHECK (payout_status IN ('pending','processing','complete')),
  created_at timestamptz DEFAULT now()
);

-- Bounty entry fees
CREATE TABLE bounty_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES competitions(id),
  profile_id uuid REFERENCES profiles(id),
  entry_fee numeric NOT NULL,
  currency text DEFAULT 'USD',
  tx_hash text, -- blockchain transaction hash if crypto
  paid_at timestamptz DEFAULT now(),
  UNIQUE(event_id, profile_id)
);
```

**Payment architecture:**
- Fiat: Stripe Connect (platform account) — supports marketplace payouts, MTL-covered
- Crypto: Stacks wallet integration (STX) — optional, user-facing toggle at event creation
- Never store card data — Stripe handles all PCI compliance

---

## Shariah Compliance Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Track A (sponsor-funded prize) | ✅ Clean | Musabaqah with third-party prize. Standard promotional competition. |
| Platform service fee | ✅ Clean | Ujrah — fee for services rendered. |
| Smart contract escrow | ✅ Clean | No interest accrues. Transparent, deterministic. Wakalah-adjacent. |
| CodePoints (non-transferable) | ✅ Clean | Reputation/merit system. No monetary value. |
| Track B (participant-funded pool) | ⚠️ Needs review | Skill competition, but scholars differ on participant-vs-participant prize pools. Get fatwa before launch. |
| Sponsor selection filter | ✅ Built-in | Ethical funder policy excludes riba-based businesses. |
| CodeCoin (transferable token) | 🔴 Deferred | Gharar risk if speculative. Revisit 2027 with scholar and legal counsel. |
| Stacks/STX as payment rail | ✅ Functional | Used as utility (transaction execution), not speculation. More permissible than trading. |

**Recommended action before Track B:** One consultation with an Islamic finance scholar, specifically on the prize pool structure. AAOIFI-certified scholars have reviewed similar fintech models. Estimated cost: $200-500 for a focused opinion.

---

## Revenue Model Summary (Phase 4 Steady State)

| Revenue Source | Model | Margin |
|----------------|-------|--------|
| Institutional partnerships (schools) | Annual fee per school | High margin, recurring |
| Sponsor packages | Per-event or annual | High margin |
| Track A service fee | 15-20% of sponsor prize contribution | Medium margin |
| Track B settlement fee | 10-15% of prize pool | Medium margin, volume-dependent |
| Featured component placement | Monthly/annual sponsor fee | High margin, low effort |

The platform doesn't need Track B to be financially viable. Institutional partnerships + sponsor packages can sustain operations at Phase 3 scale. Track B is upside.

---

*Preceding: PHASE2_SPEC.md*
*See also: OPUS_BRIEFING.md for full strategic context*

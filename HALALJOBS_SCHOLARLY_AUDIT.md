# HalalJobs.ai — Multi-Madhab Scholarly Audit Report

**Date:** March 8, 2026
**Method:** 8 parallel simulated auditors across Islamic jurisprudence
**Status:** Pre-launch review. NOT a substitute for real scholarly review.

---

## Auditors & Perspectives

1. **Hanafi Scholar** — Darul Uloom/Deoband tradition, Hanafi usul al-fiqh
2. **Shafi'i Scholar** — Southeast Asian & Yemeni tradition, Imam Nawawi principles
3. **Maliki Scholar** — North/West African tradition, maslahah mursalah
4. **Hanbali Scholar** — Gulf tradition, Ibn Taymiyyah & Ibn Qayyim methodology
5. **AAOIFI Finance Expert** — Islamic finance industry, Standard 21 specialist
6. **Salafi/Athari Scholar** — Quran & Sunnah strict adherence, Ibn Baz/Lajnah tradition
7. **Fiqh al-Aqalliyyat Scholar** — Muslim minority jurisprudence, ECFR/AMJA
8. **Muslim UX Researcher** — Accessibility, cultural sensitivity, emotional design

---

## Universal Consensus (All 8 agree)

### 1. The 5% Threshold Has No Employment Precedent
AAOIFI Standard 21's 5% rule was designed for **passive stock investment**, not active employment. No madhab endorses a percentage-based threshold for employment permissibility. The Hanbali/Salafi position rejects even 1%. Hanafi/Maliki positions require role-level analysis, not revenue percentages.

### 2. Role-Level Screening Is Missing (Critical)
All madhabs distinguish between direct participation in haram (universally prohibited), operational support (madhab-dependent), and tangential roles (generally permissible). The tool screens employers, not roles. A software engineer at JPMorgan and a loan officer get the same verdict.

### 3. "DOUBTFUL" Is Too Broad
JPMorgan (45% interest revenue) and Microsoft (15% gaming) both get DOUBTFUL. These are categorically different situations. The status conflates minor issues with fundamental ones.

### 4. Only 2 of 5 AAOIFI Criteria Implemented
Missing: debt-to-equity ratio, cash ratio, receivables ratio. The tool claims AAOIFI alignment but implements less than half the standard.

### 5. Revenue Data Is Unaudited
No source URLs, no fiscal year tracking, no confidence levels. Some revenue breakdowns appear estimated, not verified against SEC filings or annual reports.

### 6. Islamic Org Auto-Compliant Is Dangerous
`deriveScreeningStatus()` auto-passes Islamic orgs and halal-certified companies. Islamic branding ≠ Islamic compliance. Some Islamic finance institutions hold interest-bearing reserves.

### 7. No Necessity/Hardship Guidance
Refugees, students, immigrants, single parents face genuine darurah (necessity). The tool treats all users as having equal agency and choice. Risk of creating waswas (obsessive doubt) in vulnerable populations.

### 8. Madhhab Filtering Promised But Not Implemented
The about page says "filter based on your own madhhab" but provides zero mechanism for this.

---

## Madhab-Specific Findings

### Hanafi
- Missing concepts: talfiq (mixing madhabs), umum al-balwa (widespread affliction), niyyah (intention)
- Hanafi scholars apply **role-level analysis** heavily; tool doesn't support this
- Would want to see: "Is your specific role involved in haram?" before judging
- Recommended: Add Hanafi-specific disclaimer about indirect involvement

### Shafi'i
- I'anat 'ala al-ma'siyah (assisting in sin) has **3 tiers**: direct participation, operational support, tangential service
- Tool conflates all tiers into one "review" flag
- Southeast Asian context (JAKIM/MUI) entirely missing — these are the dominant Shafi'i institutions
- JPMorgan should be NON_COMPLIANT for Shafi'i users, not DOUBTFUL

### Maliki
- Maslahah (public interest) framework is sound — tool's transparency approach aligns well
- Sadd al-dhara'i (blocking means to evil) underdeveloped — needs role-level granularity
- North/West African context missing: informal economy, precarity, 80%+ informal employment
- Google/Microsoft/Amazon may be **overcategorized** as DOUBTFUL — Maliki view: infrastructure companies with incidental haram are often permissible
- **Labor ethics entirely absent** — Maliki jurisprudence strongly emphasizes worker justice (adl)

### Hanbali
- Interest-based revenue should be **auto-fail**, not review
- 5% threshold should be **0-1%** for Hanbali users
- JPMorgan definitively NON_COMPLIANT (primary business is riba)
- Kafala system (Gulf labor sponsorship) not addressed — major concern for Gulf context
- Conventional insurance should potentially auto-fail (gharar + riba)
- Ibn Taymiyyah's ta'awun 'ala al-ithm (cooperation in sin) test not operationalized

### Salafi/Athari
- Tool lacks Quranic/Hadith textual grounding — relies on AAOIFI (institutional standard, not scripture)
- Ibn Baz and the Lajnah explicitly rejected percentage-based haram tolerance
- "DOUBTFUL" category has no Quranic authorization — things are halal or haram with narrow exceptions
- Risk of bid'ah accusation: adapting finance standards to employment without scholarly precedent
- Would require: 0% haram tolerance, graduated necessity levels, Quranic citations throughout

### AAOIFI Finance Expert
- Credibility score for Islamic finance experts: **3/10**
- Only 2 of 5 AAOIFI criteria implemented
- No quantitative threshold validation in code — `deriveScreeningStatus()` uses tags, not calculations
- Revenue data: ~60% accuracy, 50% methodology score
- Microsoft gaming ≠ gambling distinction missed
- None of the established platforms (IFG, Zoya, Musaffa) do employment screening — this is first-mover territory with no proven methodology

### Fiqh al-Aqalliyyat
- No darurah (necessity) or haraj (hardship) guidance
- Risk of **waswas** (obsessive doubt) — DOUBTFUL status creates paralysis, not clarity
- May inadvertently push Muslims away from mainstream employment (isolation risk)
- Fails different populations differently: students (overcorrect), refugees (no necessity exception), converts (no educational context), parents (no family obligation consideration)
- ECFR/AMJA would want necessity as central lens, not afterthought
- Missing: role-level guidance, scholarly disagreement transparency, reassurance language

### Muslim UX Researcher
- Screening badge is visually buried (should be top of JobCard, not bottom)
- Red/amber/green system fails colorblind users (~8% of men)
- No skip links for keyboard navigation through 50+ filter options
- No RTL support (Arabic, Urdu speakers)
- Missing glossary: many users don't know what AAOIFI, madhab, or riba mean
- DOUBTFUL status creates anxiety without providing decision guidance
- Southeast Asian expectations: workplace culture info (prayer space, halal cafeteria, hijab policy)
- Emotional design gap: tool empowers users to *see* values but leaves them *alone* with discomfort

---

## Priority Fixes

### Tier 1: Critical (Must fix before launch)

| Fix | Effort | Impact |
|-----|--------|--------|
| Replace 5% threshold with madhhab-specific frameworks | 2-3 sprints | Eliminates fundamental credibility gap |
| Implement role-level screening (3 tiers minimum) | 1-2 sprints | All madhabs require this distinction |
| Add data provenance (source URLs, fiscal year, confidence) | 1 sprint | AAOIFI credibility |
| Implement remaining 3 AAOIFI criteria | 2-3 sprints | Completes standard implementation |
| Remove Islamic org auto-compliant | <1 sprint | Prevents false confidence |
| Add comprehensive disclaimers (7 listed in synthesis) | 1 sprint | Legal and religious protection |
| Reclassify JPMorgan as NON_COMPLIANT | <1 sprint | 3/4 madhabs + AAOIFI agree |

### Tier 2: High priority (Before or shortly after launch)

| Fix | Effort | Impact |
|-----|--------|--------|
| Add necessity/hardship (darurah) guidance | 1-2 sprints | Protects vulnerable users |
| Add labor ethics screening | 2-3 sprints | All madhabs implicitly require |
| Implement madhhab selection UI | 2-3 sprints | Fulfills core promise |
| Add regional authority mapping (JAKIM, MUI, ECFR, AMJA) | 2-3 sprints | SE Asian + diaspora credibility |
| Reclassify interest-based revenue as auto-fail (Hanbali mode) | <1 sprint | Hanbali/Salafi alignment |
| Add accessibility (colorblind, screen readers, skip links) | 1 sprint | 8%+ of users affected |

### Tier 3: Post-launch enhancements

| Fix | Effort | Impact |
|-----|--------|--------|
| 5th status: "Conventional Permissible" vs "Islamic Compliant" | 1 sprint | Maliki clarity |
| Scholarly disagreement transparency per company | Ongoing | Builds trust |
| Workplace culture data (prayer space, hijab policy) | 2+ sprints | SE Asian/diaspora value |
| RTL language support | 2-3 sprints | Arabic/Urdu users |
| Glossary/educational content for non-expert users | 1-2 sprints | Converts, students |
| Darurah sub-tiers (DOUBTFUL-Minor vs DOUBTFUL-Major) | 1 sprint | Reduces waswas |

---

## Marketing Audit Summary

### Positioning
- "See the job market through your values" — good but backwards for Muslim communities
- Better: "Every employer screened. You stay informed." — confident, not passive
- Lead with AAOIFI credential on landing page, not buried in about
- "Employers can't buy their way to Compliant" — HUGE trust signal, currently buried

### Audience
- Three distinct segments need different messaging: professionals, students, immigrants
- Students need: clarity and peer validation
- Immigrants need: darurah guidance and community trust
- Professionals need: efficiency and authority

### Trust Building
- Scholar panel must be visible and real (not "coming soon" forever)
- Founder credibility matters ("Built by Muslim professionals who get it")
- Community stories/testimonials needed (3-5 before launch)
- No-employer-payment model is a feature — market it prominently

### Distribution
- Reddit (r/MuslimCollege, r/islam), Discord, WhatsApp groups, mosque networks
- Content: Company case studies ("Is Google halal?") drive long-tail SEO
- Muslim media: MuslimMatters, IFG newsletter, podcasts
- Month 1 target: 600-1,000 visitors. Month 3: 2,300-3,300.

### Monetization
- Ko-fi sadaqah: sustainable for hosting, not for growth ($150-900/month at scale)
- B2B employer audits ($500-2K/audit): viable Month 4+
- University career services partnerships: $10-20K/year per institution
- Year 2 projection: $120-395K/year (full-time viable)

---

## Sharia Compliance Agentification — Precedent Research

### Existing Models
- **Zoya/Musaffa/Wahed**: Separate rule-making (scholars) from rule-application (algorithms). Scholars supervise; algorithms filter. This is the proven model.
- **Dar al-Ifta FatwaPro**: Digital fatwa service issuing 3,470+ fatwas/year, 15/day. "Human-centered, digitally enabled fatwa culture."
- **IslamQA.info**: One named scholar (Al-Munajjid) as singular authority. Credibility through long-term personal reputation.

### Scholarly Consensus on Technology
- International Islamic Fiqh Academy Resolution 260: Technology permissible if it doesn't contradict Islamic principles
- AAOIFI + IFSB: Technology acceptable for screening under Shariah board supervision
- Core limitation: **AI cannot replace maqasid al-Shariah reasoning** (understanding purposes of Islamic law)
- Scholars accept technology as **research assistant**, not **decision-maker**

### Analogous Models
- **Kosher (OK Kosher, OU)**: Database of 500K+ ingredients + "Ask the Rabbi" escalation path. Technology handles routine; rabbis handle exceptions.
- **Jewish Halakha (ShailaText)**: 10K users, 100K+ questions. Asynchronous digital consultation with named rabbis.
- **Catholic Canon Law**: Educational/informational tools that apply known rules but stop short of new rulings.

### Throughline Opportunity

Throughline Systems (gradate.ai) is an existing coordination infrastructure platform with 956 API routes, 989 tests, and a Bayesian/Heideggerian architecture designed for person-centered planning. Its core architecture maps directly to the scholarly consultation model every madhab requires.

**Architectural Mapping:**

| Throughline Component | Sharia Compliance Application |
|---|---|
| **Five-Part Architecture** (Gradient → Throughline → Astrolabe → Provenance → Gradate) | User's values/madhab → Screening continuity → Scholar perspective navigation → Decision history → Feedback to scholars |
| **Framework Swapping** (PCP → Academic → Crystallography → Agent Coordination) | Add Islamic Jurisprudence domain swap — same Bayesian engine, different ontological vocabulary |
| **Tethered Agents** with trust-calibrated membrane | Scholars as tethered agents: permeability based on madhab alignment, user trust level, and query complexity |
| **Three-Tier Validation** (person → care circle → professional) | Person → local imam/community → qualified mufti — same escalation pattern |
| **Convergence Detection** (multi-agent agreement scoring) | Multi-madhab convergence: when 3/4 madhabs agree, signal is strong; divergence = transparent disagreement |
| **Sovereign Consent Gate** (CPPA-ADMT compliant) | User controls what data scholars see, which madhab lens applies, when to override algorithmic screening |
| **Chain of Narration** (audit trail) | Isnad-like provenance: every screening decision traced to its scholarly basis, every override logged |
| **FigDataGate** (lock-and-key data access) | Per-scholar scoped access — a Hanafi scholar agent only sees Hanafi-relevant criteria |
| **CascadeEngine** (resonance, not approval chain) | Scholar consensus cascades: bedrock = Quran/Sunnah, sediment = madhab rulings, weather = contemporary ijtihad |
| **"Throughline doesn't know"** (uncertainty as feature) | "We don't issue fatwas" — architecturally enforced epistemic humility, not just a disclaimer |

**Governance Model (using Throughline's existing patterns):**
- AUTO: Algorithm classifies employer → LOW risk (clear halal/haram) → instant template response with scholarly citation
- ROUTE: MEDIUM risk (mixed activities, madhab disagreement) → 24-48hr SLA to tethered scholar agent → response carries Chain of Narration provenance
- ESCALATE: HIGH risk (novel industry, no precedent) → 1-2 week council review → convergence detection across scholar agents → transparent disagreement if no consensus
- APPEAL: User disagrees → CascadeEngine routes to higher authority → full audit trail preserved

**Why this matters:** Every successful sharia compliance model (Zoya, Musaffa, Dar al-Ifta) separates rule-making from rule-application. Throughline's architecture already implements this separation at the infrastructure level — scholars tether to the system with trust-calibrated membranes; the system routes and records but never decides. This is the "human-in-the-loop" governance that every precedent demands, made architecturally rigorous.

**B2B angle:** Islamic finance advisors use Throughline for pre-screening before scholar referral. University career services integrate HalalJobs screening into advising workflow. Throughline's existing CPPA-ADMT compliance and patent protection (Provisional 63/993,335) create defensible IP position.

### Critical Requirement
**Never position technology as replacement for scholarly consultation. Always position as access to scholars.** Every successful model maintains human-in-the-loop governance. Throughline's "Throughline doesn't know" philosophy is the architectural embodiment of this principle — the system testifies, it does not compel.

---

## Final Assessment

**Current state:** Well-intentioned, transparent, and honest about limitations — but structurally incomplete for launch to religiously observant users.

**What's right:** AAOIFI framework choice, "we don't issue fatwas" positioning, "show the whole market" philosophy, free/sadaqah model.

**What must change:** 5% threshold, role-level screening, data sourcing, AAOIFI completeness, madhhab filtering, necessity guidance, disclaimers.

**Before real scholar review:** Fix Tier 1 items so the scholar has a sound framework to review, not a broken one to reject.

**Strategic routing note:** The Throughline/agentification concept deserves its own strategic session in Claude.ai — it's bigger than HalalJobs alone. The existing Throughline architecture (956 routes, tethered agents, convergence detection, sovereign consent) provides the infrastructure layer that could make HalalJobs the first sharia compliance platform with architecturally enforced scholarly governance.

---

*This document was generated by AI-simulated scholarly perspectives. It is NOT a substitute for consultation with qualified Islamic scholars. All findings should be validated by actual fuqaha before implementation.*

*Created: March 8, 2026*

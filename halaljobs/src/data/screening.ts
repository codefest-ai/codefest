// AAOIFI-aligned shariah screening for employers
//
// This is NOT a custom scoring system. We apply the same screening criteria
// that AAOIFI, IFG, Zoya, Musaffa, and other established Islamic finance
// platforms use for stock screening — adapted for employer classification.
//
// AAOIFI Standard 21 defines the thresholds. We surface the data.
// The user interprets based on their own madhhab and circumstances.

// ─── Screening Status ───────────────────────────────────────────────
// These match the terminology used across IFG, Zoya, Musaffa, Islamicly

export type ScreeningStatus =
  | "COMPLIANT"      // Passes all AAOIFI-style screens
  | "NON_COMPLIANT"  // Fails one or more screens
  | "DOUBTFUL"       // Borderline — passes numerically but has grey areas
  | "NOT_SCREENED"   // Insufficient data to classify

export interface ScreeningStatusInfo {
  id: ScreeningStatus
  label: string
  shortLabel: string
  description: string
  color: string       // tailwind text color
  bg: string          // tailwind bg
  border: string      // tailwind border
  dot: string         // dot indicator color
}

export const SCREENING_STATUSES: Record<ScreeningStatus, ScreeningStatusInfo> = {
  COMPLIANT: {
    id: "COMPLIANT",
    label: "Compliant",
    shortLabel: "Compliant",
    description: "This employer's primary business activities and revenue sources pass AAOIFI-style shariah screening criteria.",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  NON_COMPLIANT: {
    id: "NON_COMPLIANT",
    label: "Non-Compliant",
    shortLabel: "Non-Compliant",
    description: "This employer's primary business involves activities that do not pass AAOIFI-style shariah screening criteria.",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  DOUBTFUL: {
    id: "DOUBTFUL",
    label: "Doubtful",
    shortLabel: "Doubtful",
    description: "This employer has some activities that may not pass shariah screening depending on the standard applied and your madhhab. Review the details.",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  NOT_SCREENED: {
    id: "NOT_SCREENED",
    label: "Not Screened",
    shortLabel: "Not Screened",
    description: "We don't have enough information to classify this employer. If you know more, let us know.",
    color: "text-stone-500",
    bg: "bg-stone-50",
    border: "border-stone-200",
    dot: "bg-stone-400",
  },
}

// ─── AAOIFI Screening Criteria ──────────────────────────────────────
// Based on AAOIFI Standard 21 / Shariah Standard on Investment

export interface ScreeningCriterion {
  id: string
  label: string
  description: string
  threshold: string       // human-readable threshold
  source: string          // which standard this comes from
}

export const AAOIFI_CRITERIA: ScreeningCriterion[] = [
  {
    id: "non_permissible_income",
    label: "Non-permissible income",
    description: "Revenue from non-halal sources (alcohol, gambling, pork, adult content, tobacco) as % of total revenue",
    threshold: "< 5% to pass",
    source: "AAOIFI Standard 21",
  },
  {
    id: "interest_income",
    label: "Interest-based income",
    description: "Revenue from interest (riba) as % of total revenue",
    threshold: "< 5% to pass",
    source: "AAOIFI Standard 21",
  },
  {
    id: "business_activity",
    label: "Core business activity",
    description: "The employer's primary business must not be inherently impermissible",
    threshold: "Must be permissible",
    source: "AAOIFI Standard 21",
  },
]

// ─── Activity Tags ──────────────────────────────────────────────────
// Factual tags about what the employer does — NOT judgments

export type ActivityTag =
  | "interest_based_revenue"
  | "alcohol_production"
  | "alcohol_service"
  | "gambling"
  | "weapons_manufacturing"
  | "defense_contractor"
  | "adult_content"
  | "conventional_insurance"
  | "tobacco"
  | "pork_processing"
  | "entertainment_mixed"
  | "pharmaceutical_mixed"
  | "speculation_heavy"

export type PositiveTag =
  | "islamic_mission"
  | "halal_certified"
  | "zakat_eligible"
  | "humanitarian"
  | "shariah_compliant"
  | "muslim_founded"
  | "ethical_finance"

export type CompanyType =
  | "islamic_org"
  | "halal_certified"
  | "muslim_founded"
  | "conventional"
  | "unknown"

export interface ActivityInfo {
  id: ActivityTag
  label: string
  description: string
  emoji: string
  screening_impact: "fail" | "review"  // does this auto-fail or require review?
}

export interface PositiveInfo {
  id: PositiveTag
  label: string
  description: string
  emoji: string
}

export const ACTIVITIES: ActivityInfo[] = [
  { id: "interest_based_revenue", label: "Interest-based revenue", description: "Company earns significantly from conventional interest (riba)", emoji: "🏦", screening_impact: "review" },
  { id: "alcohol_production", label: "Alcohol production", description: "Company produces alcoholic beverages", emoji: "🍷", screening_impact: "fail" },
  { id: "alcohol_service", label: "Alcohol service", description: "Company serves or distributes alcohol as part of operations", emoji: "🍺", screening_impact: "review" },
  { id: "gambling", label: "Gambling", description: "Company operates or facilitates gambling/betting", emoji: "🎰", screening_impact: "fail" },
  { id: "weapons_manufacturing", label: "Weapons manufacturing", description: "Company manufactures weapons or munitions", emoji: "💣", screening_impact: "review" },
  { id: "defense_contractor", label: "Defense contractor", description: "Works with military but not direct weapons manufacturing", emoji: "🛡️", screening_impact: "review" },
  { id: "adult_content", label: "Adult content", description: "Company produces or distributes adult/explicit content", emoji: "🔞", screening_impact: "fail" },
  { id: "conventional_insurance", label: "Conventional insurance", description: "Non-takaful insurance operations", emoji: "📋", screening_impact: "review" },
  { id: "tobacco", label: "Tobacco", description: "Company produces tobacco or vaping products", emoji: "🚬", screening_impact: "review" },
  { id: "pork_processing", label: "Pork processing", description: "Company involved in pork production or processing", emoji: "🐖", screening_impact: "fail" },
  { id: "entertainment_mixed", label: "Mixed entertainment", description: "Produces entertainment that may include haram content", emoji: "🎬", screening_impact: "review" },
  { id: "pharmaceutical_mixed", label: "Mixed pharmaceutical", description: "Products may involve haram-derived ingredients", emoji: "💊", screening_impact: "review" },
  { id: "speculation_heavy", label: "Heavy speculation", description: "Revenue significantly from speculative trading (gharar)", emoji: "📈", screening_impact: "review" },
]

export const POSITIVES: PositiveInfo[] = [
  { id: "islamic_mission", label: "Islamic mission", description: "Organization has an explicitly Islamic mission", emoji: "🕌" },
  { id: "halal_certified", label: "Halal certified", description: "Company or products hold halal certification", emoji: "✅" },
  { id: "zakat_eligible", label: "Zakat eligible", description: "Organization is eligible to receive zakat", emoji: "🤲" },
  { id: "humanitarian", label: "Humanitarian", description: "Humanitarian or social good mission", emoji: "❤️" },
  { id: "shariah_compliant", label: "Shariah compliant", description: "Verified shariah-compliant operations", emoji: "📜" },
  { id: "muslim_founded", label: "Muslim founded", description: "Founded by Muslim entrepreneur(s)", emoji: "⭐" },
  { id: "ethical_finance", label: "Ethical finance", description: "Islamic or ethical finance model", emoji: "💚" },
]

// ─── Industries ─────────────────────────────────────────────────────

export const INDUSTRIES = [
  { id: "technology", label: "Technology", emoji: "💻" },
  { id: "financial_services", label: "Financial Services", emoji: "🏦" },
  { id: "healthcare", label: "Healthcare", emoji: "🏥" },
  { id: "education", label: "Education", emoji: "📚" },
  { id: "nonprofit", label: "Nonprofit", emoji: "❤️" },
  { id: "halal_food", label: "Halal Food", emoji: "🍽️" },
  { id: "islamic_finance", label: "Islamic Finance", emoji: "💚" },
  { id: "retail", label: "Retail", emoji: "🛍️" },
  { id: "consulting", label: "Consulting", emoji: "📊" },
  { id: "media", label: "Media & Entertainment", emoji: "🎬" },
  { id: "government", label: "Government", emoji: "🏛️" },
  { id: "energy", label: "Energy", emoji: "⚡" },
  { id: "manufacturing", label: "Manufacturing", emoji: "🏭" },
  { id: "real_estate", label: "Real Estate", emoji: "🏠" },
  { id: "transportation", label: "Transportation", emoji: "🚛" },
  { id: "hospitality", label: "Hospitality", emoji: "🏨" },
  { id: "agriculture", label: "Agriculture", emoji: "🌾" },
  { id: "legal", label: "Legal", emoji: "⚖️" },
  { id: "construction", label: "Construction", emoji: "🔨" },
] as const

export type IndustryId = (typeof INDUSTRIES)[number]["id"]

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"] as const
export type JobType = (typeof JOB_TYPES)[number]

// ─── Helper: derive screening status from employer data ─────────────

export function deriveScreeningStatus(
  activities: ActivityTag[],
  positives: PositiveTag[],
  companyType: CompanyType
): ScreeningStatus {
  // Islamic orgs with shariah compliance are always compliant
  if (companyType === "islamic_org" || positives.includes("shariah_compliant")) {
    return "COMPLIANT"
  }

  // If primary business is a "fail" activity, it's non-compliant
  const failActivities = activities.filter(a => {
    const info = ACTIVITIES.find(x => x.id === a)
    return info?.screening_impact === "fail"
  })
  if (failActivities.length > 0) {
    return "NON_COMPLIANT"
  }

  // If has "review" activities, it's doubtful
  const reviewActivities = activities.filter(a => {
    const info = ACTIVITIES.find(x => x.id === a)
    return info?.screening_impact === "review"
  })
  if (reviewActivities.length > 0) {
    return "DOUBTFUL"
  }

  // Halal-certified or Muslim-founded with no activities = compliant
  if (companyType === "halal_certified" || companyType === "muslim_founded") {
    return "COMPLIANT"
  }

  // No activities at all = compliant (conventional company with no flags)
  if (activities.length === 0) {
    return "COMPLIANT"
  }

  return "NOT_SCREENED"
}

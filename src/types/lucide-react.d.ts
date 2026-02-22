declare module "lucide-react" {
  import { FC, SVGProps } from "react"

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string
    absoluteStrokeWidth?: boolean
  }

  export type LucideIcon = FC<IconProps>

  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const ArrowUpDown: LucideIcon
  export const BarChart2: LucideIcon
  export const Bookmark: LucideIcon
  export const BookOpen: LucideIcon
  export const CheckCircle: LucideIcon
  export const Mail: LucideIcon
  export const Target: LucideIcon
  export const TrendingUp: LucideIcon
  export const Clock: LucideIcon
  export const Code2: LucideIcon
  export const ExternalLink: LucideIcon
  export const Filter: LucideIcon
  export const GitFork: LucideIcon
  export const Github: LucideIcon
  export const GraduationCap: LucideIcon
  export const Layers: LucideIcon
  export const Library: LucideIcon
  export const LogIn: LucideIcon
  export const LogOut: LucideIcon
  export const Menu: LucideIcon
  export const Rocket: LucideIcon
  export const Search: LucideIcon
  export const Sparkles: LucideIcon
  export const Timer: LucideIcon
  export const Trophy: LucideIcon
  export const User: LucideIcon
  export const Users: LucideIcon
  export const X: LucideIcon
  export const Zap: LucideIcon
}

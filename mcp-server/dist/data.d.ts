export interface FurtherReading {
    title: string;
    url: string;
    type: 'paper' | 'article' | 'docs' | 'tutorial';
}
export interface Component {
    name: string;
    category: string;
    description: string;
    plain_what: string;
    plain_why: string;
    common_use: string;
    github_url: string;
    docs_url: string;
    setup_time_minutes: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    domains: string[];
    related: string[];
    further_reading: FurtherReading[];
}
export declare const COMPONENTS: Component[];
export declare const CATEGORIES: string[];

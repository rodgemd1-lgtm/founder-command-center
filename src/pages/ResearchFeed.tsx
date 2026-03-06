import { useState, useEffect } from 'react'
import { ExternalLink, Search, Globe, Youtube, MessageSquare, BookOpen, PenTool, Loader2 } from 'lucide-react'
import { businesses } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import type { ResearchEntry } from '@/types'

const SOURCE_ICONS: Record<string, typeof Globe> = {
  web: Globe,
  youtube: Youtube,
  reddit: MessageSquare,
  paper: BookOpen,
  manual: PenTool,
}

// Default research entries for when Supabase isn't connected
const defaultResearch: ResearchEntry[] = [
  {
    id: '1',
    business_id: 'transformfit',
    source_type: 'web',
    title: 'Fitness App Market Analysis 2026',
    summary: 'The global fitness app market is projected to reach $30.1B by 2027, growing at 17.6% CAGR. AI-powered personalization is the fastest-growing segment, with users willing to pay 40% premium for adaptive workout plans.',
    key_insights: ['AI personalization drives 40% price premium', 'Retention is #1 challenge — average fitness app loses 75% of users in first month', 'Social features increase 90-day retention by 2.3x'],
    tags: ['market-size', 'AI', 'retention'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '2',
    business_id: 'transformfit',
    source_type: 'youtube',
    title: 'How Noom Built a $4B Health App',
    summary: 'Noom\'s success came from cognitive behavioral therapy integration, not just calorie counting. Their trial-to-paid conversion is 30% vs industry average of 8%. Key: psychology-first, technology-second approach.',
    key_insights: ['CBT integration tripled retention', '30% trial-to-paid conversion rate', 'Coach matching algorithm is their moat'],
    tags: ['noom', 'conversion', 'psychology'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '3',
    business_id: 'transformfit',
    source_type: 'web',
    title: 'Stripe Subscription Best Practices for Mobile',
    summary: 'Mobile subscription apps should implement: grace periods for failed payments (recovers 15% of churned users), annual plan discounts (25% of users choose annual if discount > 20%), and multiple payment retry logic.',
    key_insights: ['Grace periods recover 15% of involuntary churn', 'Annual plans reduce churn by 40%', 'Smart retry logic recovers 8% more failed payments'],
    tags: ['stripe', 'payments', 'churn'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '4',
    business_id: 'viral-architect',
    source_type: 'web',
    title: 'Instagram API Changes & Meta App Review 2026',
    summary: 'Meta\'s API v19+ requires Business verification and app review for all content publishing endpoints. Average review time: 2-4 weeks. Key requirements: demo video, privacy policy, data handling documentation.',
    key_insights: ['App review takes 2-4 weeks average', 'Business verification is now mandatory', 'Rate limits increased for verified apps'],
    tags: ['instagram-api', 'meta', 'app-review'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '5',
    business_id: 'viral-architect',
    source_type: 'reddit',
    title: 'Creator Economy: What Tools Creators Actually Pay For',
    summary: 'Reddit threads from r/InstagramMarketing and r/socialmedia reveal creators primarily pay for: scheduling (87%), analytics (62%), hashtag research (41%), and AI caption generation (growing fast at 34%). Top frustration: tools that post but don\'t analyze.',
    key_insights: ['87% of creators pay for scheduling tools', 'Analytics is 2nd most valued feature', 'AI content generation is fastest growing demand'],
    tags: ['creator-tools', 'pricing', 'demand'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '6',
    business_id: 'viral-architect',
    source_type: 'web',
    title: 'Content Automation Platform Comparison',
    summary: 'Later (7M+ users), Buffer (4M+), Hootsuite (16M+) dominate scheduling. None offer AI-native content generation as core feature. Gap: autonomous content creation from brand guidelines without manual input.',
    key_insights: ['No major competitor offers AI-native content generation', 'Average pricing: $25-67/mo for pro features', 'Enterprise segment is $200+/mo with 80% margins'],
    tags: ['competitors', 'market-gap', 'pricing'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '7',
    business_id: 'intelligence-engine',
    source_type: 'web',
    title: 'Competitive Intelligence Platform Market',
    summary: 'Crayon ($30M ARR), Klue ($20M ARR), and Kompyte lead the market. Average deal size: $50K/yr. Key differentiator opportunity: real-time intelligence with AI synthesis vs. manual battle card updates.',
    key_insights: ['Market leaders charge $50K+/yr average', 'AI-powered synthesis is the key gap', 'Win/loss analysis is highest-value feature'],
    tags: ['competitive-intel', 'market-size', 'pricing'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '8',
    business_id: 'automotive-os',
    source_type: 'web',
    title: 'Shop Management Software Market Overview',
    summary: 'Tekmetric ($50M+ funding), Shop-Ware, and Mitchell 1 dominate. Market growing at 12% CAGR. Key trend: AI-powered diagnostic integration and customer communication automation. Most shops still use paper or basic software.',
    key_insights: ['60% of independent shops lack modern software', 'AI diagnostics is greenfield opportunity', 'Average shop pays $200-400/mo for management software'],
    tags: ['automotive', 'market-size', 'opportunity'],
    ingested_at: new Date().toISOString()
  },
  // ─── TRANSFORMFIT: Entity Formation & Banking ───
  {
    id: '9',
    business_id: 'transformfit',
    source_type: 'web',
    title: 'LLC Formation for Fitness App Startups — State-by-State Guide',
    summary: 'Wyoming and Delaware remain the top choices for LLC formation. Wyoming has zero state income tax and $100 annual report fee; Delaware offers the Court of Chancery for business disputes. Single-member LLCs provide pass-through taxation — critical when pre-revenue. Filing costs range from $50 (Kentucky) to $500 (Massachusetts).',
    key_insights: ['Wyoming LLC: $100/yr maintenance, no state income tax, strong asset protection', 'Delaware LLC preferred if raising VC due to established case law', 'Register as foreign LLC in your home state if operating there — penalties for non-compliance range $200-$1,000/yr'],
    tags: ['entity-formation', 'LLC', 'legal', 'startup-ops'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '10',
    business_id: 'transformfit',
    source_type: 'youtube',
    title: 'Mercury vs Relay vs Brex — Startup Banking Breakdown 2026',
    summary: 'Mercury leads startup banking with 200K+ accounts, offering up to $5M FDIC via sweep networks. Relay focuses on envelope budgeting with up to 20 checking accounts per business. Brex requires $50K+ balance or VC funding. Mercury Treasury yields ~4.7% APY on idle cash, which matters for runway management.',
    key_insights: ['Mercury: best for tech startups, API-first, integrates with QuickBooks/Xero in <5 min', 'Relay: best for bootstrapped founders who want visual cash-flow budgeting', 'Brex: best for funded startups needing corporate cards with no personal guarantee'],
    tags: ['banking', 'mercury', 'finops', 'startup-ops'],
    ingested_at: new Date().toISOString()
  },
  // ─── TRANSFORMFIT: Pricing Strategy ───
  {
    id: '11',
    business_id: 'transformfit',
    source_type: 'paper',
    title: 'Value-Based Pricing for Consumer Health Apps — Meta-Analysis',
    summary: 'Analysis of 340 health/fitness apps shows median subscription price of $12.99/mo and $79.99/yr. Apps with AI personalization charge 35-60% premium. Trial length sweet spot is 7 days (14-day trials show 18% lower conversion). Price anchoring with an expensive tier increases mid-tier conversion by 22%.',
    key_insights: ['7-day free trial converts 23% better than 14-day for fitness apps', 'Three-tier pricing with decoy increases mid-tier selection by 22%', 'Annual plan discount of 40-50% off monthly drives 31% annual adoption rate'],
    tags: ['pricing', 'value-based', 'subscription', 'conversion'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '12',
    business_id: 'transformfit',
    source_type: 'web',
    title: 'Freemium vs Premium-Only: Mobile Fitness App Economics',
    summary: 'Freemium fitness apps average 2.4% free-to-paid conversion (Strava achieves 7.2% as outlier). Premium-only apps see 4x higher ARPU but 60% fewer downloads. Hybrid model (free core + premium AI features) is emerging as the optimal path — MyFitnessPal reports 85% of revenue from 8% of users on premium tier.',
    key_insights: ['Industry average free-to-paid conversion: 2.4% for fitness category', 'Strava achieves 7.2% conversion by gating social/competitive features', 'Hybrid model: free workout tracking + paid AI coaching is highest LTV path'],
    tags: ['freemium', 'premium', 'conversion', 'monetization'],
    ingested_at: new Date().toISOString()
  },
  // ─── TRANSFORMFIT: UX/UI Design Methodology ───
  {
    id: '13',
    business_id: 'transformfit',
    source_type: 'youtube',
    title: 'Double Diamond Design Process for Mobile Fitness Apps',
    summary: 'The Double Diamond (Discover-Define-Develop-Deliver) framework reduces design rework by 40% when applied rigorously. For fitness apps specifically: the Discover phase should include 8-12 user interviews with gym-goers, the Define phase narrows to 2-3 core jobs-to-be-done. Average design sprint takes 5 days and costs $15K-$25K at agencies vs. $0 with founder-led sprints.',
    key_insights: ['8-12 user interviews reach saturation for 85% of usability issues', 'Design sprints reduce time-to-validated-prototype from 3 months to 5 days', 'Mobile-first constraint forces prioritization — top 3 features only on home screen'],
    tags: ['design', 'double-diamond', 'design-sprint', 'UX-research'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '14',
    business_id: 'transformfit',
    source_type: 'web',
    title: 'Mobile-First Design Systems for Health & Fitness — 2026 Best Practices',
    summary: 'High-performing fitness apps share common patterns: thumb-zone optimized CTAs (bottom 40% of screen), dark mode default (78% of fitness app users prefer dark), and motion design for exercise demos. Design system adoption reduces UI inconsistencies by 60% and speeds development 34%. Figma-to-code pipelines via Locofy/Anima cut front-end time 50%.',
    key_insights: ['78% of fitness app users prefer dark mode — make it default', 'Bottom-nav with 4-5 items outperforms hamburger menu by 2.1x in task completion', 'Design tokens (spacing, color, type) reduce cross-platform inconsistency by 60%'],
    tags: ['design-system', 'mobile-first', 'dark-mode', 'UI-patterns'],
    ingested_at: new Date().toISOString()
  },
  // ─── TRANSFORMFIT: Product-Market Fit ───
  {
    id: '15',
    business_id: 'transformfit',
    source_type: 'manual',
    title: 'Product-Market Fit Validation Playbook — Sean Ellis Test & Beyond',
    summary: 'The Sean Ellis test ("How would you feel if you could no longer use this product?") threshold is 40% answering "very disappointed." Superhuman hit 58% before scaling. For fitness apps, supplement with NPS (target >50) and Day-7 retention (target >25%). Run the test with minimum 40 respondents who used the product 2+ times in the last 2 weeks.',
    key_insights: ['40% "very disappointed" = PMF threshold; aim for 50%+ before paid acquisition', 'Day-7 retention >25% is the leading indicator of PMF for fitness apps', 'Conduct 30-minute user interviews with top 10% power users to find your "aha moment"'],
    tags: ['PMF', 'sean-ellis', 'retention', 'validation'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '16',
    business_id: 'transformfit',
    source_type: 'reddit',
    title: 'r/startups PMF Signals — What Founders Wish They Measured Earlier',
    summary: 'Aggregated from 50+ r/startups and r/SaaS threads: founders consistently report organic word-of-mouth (users inviting others without prompting) as the strongest PMF signal. Quantitatively: >40% weekly active usage, support tickets asking for MORE features (not bug complaints), and users building workflows around your product. Common anti-pattern: mistaking paid-acquisition growth for PMF.',
    key_insights: ['Organic referral without incentive is the #1 PMF signal cited by successful founders', 'Weekly active / Monthly active ratio >40% indicates strong engagement-based PMF', 'Anti-pattern: 80% of failed startups confused paid growth with product-market fit'],
    tags: ['PMF', 'signals', 'community-insights', 'engagement'],
    ingested_at: new Date().toISOString()
  },
  // ─── TRANSFORMFIT: Legal & Compliance ───
  {
    id: '17',
    business_id: 'transformfit',
    source_type: 'web',
    title: 'HIPAA Considerations for AI Fitness & Health Apps',
    summary: 'Fitness apps that collect biometric data (heart rate, sleep, body composition) may trigger HIPAA if integrated with healthcare providers. Pure consumer wellness apps are generally exempt, but the FTC has fined health apps $1.5M+ for undisclosed data sharing. The Health Breach Notification Rule now applies to non-HIPAA health apps since 2023. Apple HealthKit and Google Health Connect have their own data handling requirements.',
    key_insights: ['Pure fitness tracking is HIPAA-exempt, but adding provider integration triggers compliance', 'FTC Health Breach Notification Rule requires breach disclosure even for non-HIPAA apps', 'Apple HealthKit mandates: no advertising with health data, no iCloud sync of health data without encryption'],
    tags: ['HIPAA', 'compliance', 'legal', 'health-data', 'privacy'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '18',
    business_id: 'transformfit',
    source_type: 'manual',
    title: 'Terms of Service & Privacy Policy Essentials for Fitness Apps',
    summary: 'Minimum viable legal stack: Terms of Service, Privacy Policy, and Cookie Policy. Cost: $2K-$5K via startup lawyer, $500-$1K via Termly/Iubenda templates. CCPA applies if >$25M revenue or 50K+ California users. GDPR applies if any EU users — requires explicit consent, data portability, and right to deletion. App Store requires privacy policy URL before submission.',
    key_insights: ['Termly/Iubenda generate compliant policies for $500-$1K — sufficient for pre-Series A', 'CCPA threshold: $25M revenue OR 50K+ CA consumers OR 50%+ revenue from selling data', 'App Store rejection rate for missing/inadequate privacy policy: ~12% of submissions'],
    tags: ['legal', 'ToS', 'privacy-policy', 'CCPA', 'GDPR'],
    ingested_at: new Date().toISOString()
  },
  // ─── TRANSFORMFIT: Customer Onboarding & Retention ───
  {
    id: '19',
    business_id: 'transformfit',
    source_type: 'youtube',
    title: 'First-Week Experience Design for Fitness App Retention',
    summary: 'Duolingo-style onboarding (progressive profiling + immediate value) achieves 2.8x Day-7 retention vs. traditional signup flows. Key: deliver first workout within 90 seconds of download. Fitness apps that personalize the onboarding quiz (goal, fitness level, equipment) see 45% higher completion rates. Streaks and daily goals should activate by Day 2.',
    key_insights: ['Time-to-first-value under 90 seconds correlates with 2.8x better Day-7 retention', 'Onboarding quiz completion predicts 60-day retention with 72% accuracy', 'Streak mechanics activated by Day 2 increase 30-day retention by 34%'],
    tags: ['onboarding', 'retention', 'first-week', 'streaks', 'gamification'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '20',
    business_id: 'transformfit',
    source_type: 'paper',
    title: 'Push Notification Strategy for Health Apps — Optimal Frequency & Timing',
    summary: 'Research across 1.2M fitness app users shows optimal push notification frequency is 3-5 per week. More than 7/week increases opt-out rate by 280%. Best times: 6-8 AM (workout reminders), 12-1 PM (nutrition), 8-9 PM (next-day prep). Personalized notifications (using name + specific workout) see 4.1x higher open rates than generic messages. Rich notifications with images get 56% more engagement.',
    key_insights: ['3-5 push notifications per week is the sweet spot; >7/week causes 280% more opt-outs', 'Personalized push (name + context) achieves 4.1x open rate vs generic', 'Morning workout reminders at user-specific wake time boost session starts by 38%'],
    tags: ['push-notifications', 'retention', 'engagement', 'timing'],
    ingested_at: new Date().toISOString()
  },
  // ─── TRANSFORMFIT: App Store Optimization ───
  {
    id: '21',
    business_id: 'transformfit',
    source_type: 'web',
    title: 'ASO Playbook for Fitness Apps — Keywords, Screenshots & Ratings',
    summary: 'Top 10 fitness app keywords by search volume: "workout" (78), "fitness" (72), "exercise" (65), "gym" (61), "weight loss" (58). Screenshot A/B testing increases conversion by 17-28%. The first 3 screenshots drive 80% of install decisions. Apps with 4.5+ stars get 7x more organic installs than 4.0-rated apps. Responding to negative reviews within 24 hours improves rating by 0.7 stars average.',
    key_insights: ['First 3 screenshots account for 80% of App Store conversion impact', 'Apps rated 4.5+ stars receive 7x more organic installs than those at 4.0', 'Keyword optimization in title + subtitle drives 65% of ASO discoverability'],
    tags: ['ASO', 'app-store', 'keywords', 'screenshots', 'ratings'],
    ingested_at: new Date().toISOString()
  },
  // ─── TRANSFORMFIT: Influencer Marketing ───
  {
    id: '22',
    business_id: 'transformfit',
    source_type: 'web',
    title: 'Micro-Influencer Strategy for Fitness Brands — ROI & Execution',
    summary: 'Micro-influencers (10K-100K followers) deliver 3.8x higher engagement than macro-influencers in fitness. Average cost: $200-$1,000 per post. Nano-influencers (1K-10K) achieve 7.2% engagement rate vs 1.1% for 1M+ accounts. UGC repurposing rights add $100-$300 to the deal but provide 6-12 months of ad creative. Fitness creator partnerships convert best with 30-day challenge formats.',
    key_insights: ['Micro-influencers (10K-100K): $200-$1K/post, 3.8% avg engagement rate', 'Nano-influencers (1K-10K) hit 7.2% engagement — best for early traction on $0 budget with product trades', '30-day challenge format UGC converts 2.4x better than single-post sponsorships'],
    tags: ['influencer', 'micro-influencer', 'UGC', 'fitness-marketing'],
    ingested_at: new Date().toISOString()
  },
  // ─── TRANSFORMFIT: Sales & Revenue Operations ───
  {
    id: '23',
    business_id: 'transformfit',
    source_type: 'manual',
    title: 'Subscription Analytics & Cohort Analysis for Fitness Apps',
    summary: 'Key metrics to track from Day 1: MRR, subscriber churn rate (target <5%/mo for consumer), LTV:CAC ratio (target 3:1+), and trial-to-paid conversion. Cohort analysis by acquisition channel reveals true ROI — Instagram ads typically show 2.1x LTV vs Google Search at 3.4x for fitness. RevenueCat provides real-time subscription analytics with 5-minute integration for iOS/Android.',
    key_insights: ['Target subscriber churn <5%/month; best-in-class fitness apps achieve 3.2%', 'LTV:CAC ratio of 3:1 is the minimum viable threshold; 5:1 for profitable scaling', 'RevenueCat + Amplitude integration gives cohort-level subscription insights in <1 day setup'],
    tags: ['subscription-analytics', 'cohort-analysis', 'LTV', 'churn', 'RevenueCat'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '24',
    business_id: 'transformfit',
    source_type: 'web',
    title: 'LTV Optimization Levers for Consumer Fitness Subscriptions',
    summary: 'Average fitness app LTV is $35-$65 for monthly subscribers and $80-$140 for annual. Top levers to increase LTV: (1) annual plan migration campaigns at month 3 (+40% LTV), (2) premium tier upsells at engagement milestones (+25%), (3) family/couples plans (+60% revenue per account). Involuntary churn (failed payments) accounts for 20-40% of total churn — Stripe Smart Retries recover 15% of these.',
    key_insights: ['Annual plan migration at month 3 increases per-user LTV by 40%', 'Involuntary churn is 20-40% of total — low-hanging fruit with payment retry automation', 'Family plan upsell increases revenue per account by 60% with near-zero marginal cost'],
    tags: ['LTV', 'optimization', 'annual-plans', 'upsell', 'revenue'],
    ingested_at: new Date().toISOString()
  },
  // ─── VIRAL ARCHITECT: Entity Formation & Banking ───
  {
    id: '25',
    business_id: 'viral-architect',
    source_type: 'web',
    title: 'Entity Formation for B2B SaaS Startups — LLC vs C-Corp Decision Framework',
    summary: 'If planning to raise VC: Delaware C-Corp is mandatory (97% of VC-backed startups are DE C-Corps). If bootstrapping: LLC with S-Corp election saves 15.3% on self-employment taxes above $40K profit. Stripe Atlas automates DE C-Corp formation for $500 (includes EIN, bank account, stock issuance). For bootstrapped SaaS: Wyoming LLC at $100 + registered agent at $50/yr is the lean path.',
    key_insights: ['VC path: Delaware C-Corp is non-negotiable — 97% of funded startups use it', 'Bootstrap path: LLC + S-Corp election saves 15.3% SE tax on profits above reasonable salary', 'Stripe Atlas: $500 all-in for DE C-Corp + bank account + legal docs — live in 48 hours'],
    tags: ['entity-formation', 'C-Corp', 'LLC', 'SaaS', 'Stripe-Atlas'],
    ingested_at: new Date().toISOString()
  },
  // ─── VIRAL ARCHITECT: Pricing Strategy ───
  {
    id: '26',
    business_id: 'viral-architect',
    source_type: 'paper',
    title: 'B2B SaaS Pricing Models — Usage-Based vs Seat-Based vs Flat-Rate',
    summary: 'Usage-based pricing (UBP) is adopted by 61% of SaaS companies in 2025 (up from 34% in 2020). UBP companies report 137% net dollar retention vs 110% for seat-based. However, UBP adds billing complexity and revenue unpredictability. Hybrid model (base platform fee + usage overage) is emerging as best-of-both-worlds — adopted by Vercel, OpenAI, and Twilio. Free tier should cap at the "aha moment" threshold.',
    key_insights: ['Usage-based pricing drives 137% net dollar retention vs 110% for seat-based', 'Hybrid pricing (base + usage) reduces churn 23% vs pure usage-based', 'Free tier cap should sit just below the activation metric threshold to drive upgrades'],
    tags: ['pricing', 'usage-based', 'SaaS', 'NDR', 'hybrid-pricing'],
    ingested_at: new Date().toISOString()
  },
  {
    id: '27',
    business_id: 'viral-architect',
    source_type: 'reddit',
    title: 'r/SaaS: Free Tier Strategies That Actually Convert for Creator Tools',
    summary: 'Top-voted threads reveal successful creator tool free tiers: Buffer gives 3 channels free (upsells at scale), Canva offers unlimited designs with watermarked premium templates. Key pattern: free tier must deliver real value (not crippled demo). Best-converting gates: number of posts/month (Later), AI generation credits (Jasper), team collaboration (Figma). Average free-to-paid conversion for creator tools: 3-5%.',
    key_insights: ['Free tier must deliver standalone value — "crippled demos" convert 70% worse', 'Best gates for creator tools: usage limits (posts/month) not feature removal', 'Targeting 3-5% free-to-paid conversion is realistic; 7%+ indicates strong PMF'],
    tags: ['free-tier', 'conversion', 'creator-tools', 'pricing-strategy'],
    ingested_at: new Date().toISOString()
  },
  // ─── VIRAL ARCHITECT: Viral Coefficient & K-Factor ───
  {
    id: '28',
    business_id: 'viral-architect',
    source_type: 'paper',
    title: 'Viral Coefficient & K-Factor Optimization — Growth Engineering Deep Dive',
    summary: 'K-factor = invitations sent per user x conversion rate per invitation. K > 1 means exponential growth. Average social app K-factor: 0.15-0.25. Dropbox achieved K=0.6 with referral incentives (2-sided: 500MB per referral). To boost K: reduce friction in sharing (pre-filled messages +40%), add social proof (X friends joined +28%), and create share-worthy moments (achievement cards, reports). Instagram\'s "photo tagged you" notifications achieved K=1.2 in early growth.',
    key_insights: ['K > 0.5 is excellent for SaaS; K > 1.0 only achieved by top social products', 'Pre-filled referral messages increase invitation send rate by 40%', 'Two-sided referral incentives (both parties benefit) convert 2.8x better than one-sided'],
    tags: ['viral-coefficient', 'K-factor', 'referrals', 'growth-engineering'],
    ingested_at: new Date().toISOString()
  },
  // ─── VIRAL ARCHITECT: Customer Success ───
  {
    id: '29',
    business_id: 'viral-architect',
    source_type: 'web',
    title: 'Customer Success for SaaS — Onboarding, Activation Metrics & Health Scores',
    summary: 'SaaS companies with dedicated CS see 24% lower churn and 32% higher expansion revenue. Activation metric for content tools: user publishes first post within 48 hours (correlates with 6-month retention at r=0.74). Health score formula: login frequency (30%) + feature adoption breadth (25%) + support ticket sentiment (20%) + billing reliability (15%) + NPS (10%). Red flag: usage drop >40% week-over-week predicts churn with 82% accuracy.',
    key_insights: ['Activation target: first post published within 48 hours of signup', 'Usage drop >40% WoW predicts churn with 82% accuracy — trigger intervention', 'Customer health score should weight engagement (55%) > support (20%) > billing (15%) > NPS (10%)'],
    tags: ['customer-success', 'activation', 'health-score', 'churn-prediction'],
    ingested_at: new Date().toISOString()
  },
  // ─── VIRAL ARCHITECT: Content Marketing & SEO ───
  {
    id: '30',
    business_id: 'viral-architect',
    source_type: 'youtube',
    title: 'Content Marketing & SEO for Developer/Creator Tools — 2026 Playbook',
    summary: 'Programmatic SEO (template pages at scale) drives 40-60% of traffic for tools like Zapier (25K+ integration pages) and Canva (template gallery). For creator tools: "how to" + platform name keywords have 3x conversion rate vs. top-funnel content. Blog-to-signup conversion benchmark: 1.5-2.5% for creator tools. Distribution channels ranked by CAC: SEO ($15), Twitter/X organic ($22), YouTube ($35), paid search ($85).',
    key_insights: ['Programmatic SEO (template/integration pages) can generate 40-60% of total organic traffic', '"How to [task] on [platform]" keywords convert 3x better than top-funnel content', 'SEO CAC ($15) is 5.7x cheaper than paid search ($85) for creator tools'],
    tags: ['content-marketing', 'SEO', 'programmatic-SEO', 'CAC', 'creator-tools'],
    ingested_at: new Date().toISOString()
  },
  // ─── VIRAL ARCHITECT: Outbound Sales ───
  {
    id: '31',
    business_id: 'viral-architect',
    source_type: 'web',
    title: 'Outbound Sales for Creator Economy Tools — Playbook & Benchmarks',
    summary: 'Cold email to creators: average open rate 38%, reply rate 4.2%, demo booking rate 1.8%. Best subject lines reference their specific content/niche. LinkedIn DMs to social media managers convert 2.1x better than email for B2B creator tools. Outbound sequence: 4 touches over 12 days (email, LinkedIn, email, breakup email). Agency partnerships (white-label) provide 30-50% of revenue for Later and Sprout Social.',
    key_insights: ['Personalized cold email (reference their content) achieves 38% open, 4.2% reply rate', 'Agency white-label partnerships generate 30-50% of revenue for top social media tools', '4-touch sequence over 12 days is optimal — more touches show diminishing returns after 5th'],
    tags: ['outbound-sales', 'cold-email', 'creator-economy', 'agency-partnerships'],
    ingested_at: new Date().toISOString()
  },
  // ─── VIRAL ARCHITECT: Legal & Compliance ───
  {
    id: '32',
    business_id: 'viral-architect',
    source_type: 'manual',
    title: 'Legal Compliance for Social Media Tools — Platform ToS, GDPR & Data Privacy',
    summary: 'Meta Platform Terms prohibit: automated posting without user presence, scraping public profiles, storing Instagram data >24 hours without refresh. GDPR requirements for EU users: explicit consent for data processing, 72-hour breach notification, Data Protection Impact Assessment for large-scale profiling. California CCPA requires "Do Not Sell" opt-out. SOC 2 Type II certification is increasingly expected by enterprise clients — audit costs $30K-$80K.',
    key_insights: ['Meta ToS: cached Instagram data must be refreshed every 24 hours — build TTL into your data layer', 'GDPR breach notification window is 72 hours — have an incident response playbook ready pre-launch', 'SOC 2 Type II costs $30K-$80K but is table-stakes for selling to agencies/enterprises'],
    tags: ['legal', 'GDPR', 'platform-ToS', 'Meta-compliance', 'SOC2'],
    ingested_at: new Date().toISOString()
  },
  // ─── INTELLIGENCE ENGINE: Enterprise Sales ───
  {
    id: '33',
    business_id: 'intelligence-engine',
    source_type: 'youtube',
    title: 'Enterprise SaaS Sales Playbook — From $0 to $10M ARR',
    summary: 'Enterprise sales cycles average 3-9 months with 5.4 stakeholders involved. Winning playbook: land with a champion (IC who feels the pain), expand via a pilot ($5K-$15K, 90 days), then convert to enterprise contract ($50K-$200K/yr). MEDDPICC qualification framework increases close rates 22% vs. unstructured sales. Top enterprise SaaS companies achieve 120-140% net dollar retention via seat expansion and upsells.',
    key_insights: ['MEDDPICC qualification increases enterprise close rates by 22%', 'Pilot-to-enterprise conversion rate benchmark: 40-60% at $50K+ ACV', 'Net dollar retention of 120%+ means you can lose 20% of customers and still grow — this is the enterprise SaaS superpower'],
    tags: ['enterprise-sales', 'MEDDPICC', 'sales-playbook', 'NDR', 'pilot'],
    ingested_at: new Date().toISOString()
  },
  // ─── INTELLIGENCE ENGINE: Pricing ───
  {
    id: '34',
    business_id: 'intelligence-engine',
    source_type: 'web',
    title: 'Pricing for Data & Intelligence Platforms — Market Benchmarks',
    summary: 'Intelligence platforms segment into three tiers: self-serve ($99-$499/mo, <100 users), mid-market ($500-$2K/mo, 100-1000 users), and enterprise ($50K-$250K/yr, custom). Value metric should align with business impact: per-competitive-profile, per-alert, or per-seat. ZoomInfo charges $15K-$40K/yr per seat for sales intelligence. Crayon charges per competitor tracked ($8K-$15K/yr base). Pricing power comes from integrating into the customer\'s decision workflow.',
    key_insights: ['Value metric tied to outcomes (per-insight, per-competitor) commands 3x premium over per-seat', 'ZoomInfo ($15-40K/seat/yr) and Crayon ($8-15K/yr) set the pricing ceiling for intelligence tools', 'Integration into CRM/Slack workflows increases willingness-to-pay by 45% and reduces churn 30%'],
    tags: ['pricing', 'intelligence-platform', 'enterprise', 'value-metric'],
    ingested_at: new Date().toISOString()
  },
  // ─── INTELLIGENCE ENGINE: RAG Architecture ───
  {
    id: '35',
    business_id: 'intelligence-engine',
    source_type: 'paper',
    title: 'RAG Architecture Best Practices 2026 — Chunking, Retrieval & Evaluation',
    summary: 'State-of-the-art RAG in 2026: hybrid retrieval (dense vectors + BM25 sparse) improves recall 18% over pure vector search. Optimal chunk size: 512-1024 tokens with 20% overlap. Re-ranking with cross-encoders (ColBERT v2, Cohere Rerank) boosts precision by 25-35%. Evaluation framework: use RAGAS metrics (faithfulness, answer relevancy, context recall). Production stack: pgvector on Supabase or Pinecone for <10M vectors, Qdrant/Weaviate for larger scale.',
    key_insights: ['Hybrid retrieval (dense + sparse) improves recall 18% — always combine vector + keyword search', 'Chunk size 512-1024 tokens with 20% overlap is the current sweet spot for accuracy', 'Cross-encoder re-ranking (ColBERT v2) after initial retrieval boosts precision 25-35% at ~50ms latency cost'],
    tags: ['RAG', 'vector-search', 'chunking', 'retrieval', 'architecture'],
    ingested_at: new Date().toISOString()
  },
  // ─── AUTOMOTIVE OS: Vertical SaaS GTM ───
  {
    id: '36',
    business_id: 'automotive-os',
    source_type: 'web',
    title: 'Vertical SaaS Go-To-Market — Lessons from ServiceTitan, Toast & Procore',
    summary: 'Vertical SaaS winners follow the "land with workflow, expand with fintech" playbook. ServiceTitan (HVAC/plumbing) reached $500M ARR by embedding payments, financing, and payroll into the workflow. Toast captured 13% of US restaurants by offering $0 software + payments monetization. Key: own the transaction layer. Vertical SaaS NRR averages 115-125% — higher than horizontal SaaS due to switching costs. CAC payback for vertical SaaS: 12-18 months via field sales.',
    key_insights: ['Vertical SaaS NRR of 115-125% exceeds horizontal SaaS by 10-15 percentage points', '"Free software + payments revenue" model (Toast) accelerates adoption 4x in fragmented markets', 'Embedded fintech (payments, lending, payroll) can be 40-60% of total revenue at scale'],
    tags: ['vertical-SaaS', 'GTM', 'embedded-fintech', 'ServiceTitan', 'Toast'],
    ingested_at: new Date().toISOString()
  },
  // ─── AUTOMOTIVE OS: Field Sales ───
  {
    id: '37',
    business_id: 'automotive-os',
    source_type: 'youtube',
    title: 'Field Sales for Automotive Shops — Territory Planning & Demo Strategy',
    summary: 'Independent auto repair shops (280K+ in the US) prefer in-person demos — 3.2x higher close rate vs. Zoom for blue-collar vertical SaaS. Optimal territory: 200-300 shops within 45-minute drive radius. Door-to-door approach: visit during slow hours (2-4 PM), bring a tablet demo, leave behind a one-pager with QR code. Average field rep closes 8-12 shops/month at $300/mo ARPU. Break-even: 40 shops per rep pays for $80K OTE.',
    key_insights: ['In-person demos close 3.2x better than Zoom for auto shop software sales', 'Territory sweet spot: 200-300 shops within 45-min radius per field rep', 'Field rep economics: 8-12 closes/month at $300 ARPU covers $80K OTE at 40 shops'],
    tags: ['field-sales', 'automotive', 'territory-planning', 'in-person-demo'],
    ingested_at: new Date().toISOString()
  },
  // ─── AUTOMOTIVE OS: Regulatory ───
  {
    id: '38',
    business_id: 'automotive-os',
    source_type: 'manual',
    title: 'Regulatory Considerations for Auto Repair Software — State Requirements & OBD-II',
    summary: 'Auto repair software must comply with state-specific requirements: California BAR (Bureau of Automotive Repair) mandates digital inspection records retention for 3 years. Right to Repair laws (enacted in 8+ states) require OEMs to provide diagnostic data access. OBD-II data access via ELM327/J2534 interfaces is standardized but some advanced diagnostics remain OEM-locked. EPA regulations govern emissions-related repair documentation. PCI DSS compliance required if processing payments in-shop.',
    key_insights: ['California BAR requires 3-year digital record retention — build archival into the product from Day 1', 'Right to Repair laws in 8+ states are expanding OBD-II data access — build integrations early', 'PCI DSS compliance for in-shop payments: use Stripe Terminal to offload compliance burden'],
    tags: ['regulatory', 'automotive', 'right-to-repair', 'OBD-II', 'compliance'],
    ingested_at: new Date().toISOString()
  },
]

export function ResearchFeed() {
  const [research, setResearch] = useState<ResearchEntry[]>(defaultResearch)
  const [isLoading, setIsLoading] = useState(true)
  const [filterBusiness, setFilterBusiness] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadResearch()
  }, [filterBusiness])

  const loadResearch = async () => {
    setIsLoading(true)
    if (!supabase) {
      setIsLoading(false)
      return
    }
    try {
      let query = supabase.from('research_log').select('*').order('ingested_at', { ascending: false })
      if (filterBusiness !== 'all') query = query.eq('business_id', filterBusiness)
      const { data, error } = await query
      if (error) throw error
      if (data?.length) setResearch(data as ResearchEntry[])
    } catch (err) {
      console.warn('Failed to load research from Supabase, keeping default data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = research.filter(r => {
    if (filterBusiness !== 'all' && r.business_id !== filterBusiness) return false
    if (filterSource !== 'all' && r.source_type !== filterSource) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Research Feed</h1>
        <p className="text-sm text-gray-500">Domain research and competitive intelligence across your portfolio</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search research..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filterBusiness}
          onChange={e => setFilterBusiness(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
        >
          <option value="all">All Businesses</option>
          {businesses.map(b => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </select>
        <select
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
        >
          <option value="all">All Sources</option>
          <option value="web">Web</option>
          <option value="youtube">YouTube</option>
          <option value="reddit">Reddit</option>
          <option value="paper">Papers</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {/* Research Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          </div>
        ) : null}
        {filtered.map(entry => {
          const SourceIcon = SOURCE_ICONS[entry.source_type] || Globe
          return (
            <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <SourceIcon className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 capitalize">{entry.source_type}</span>
                    {entry.business_id && (
                      <span className="text-xs text-gray-400">
                        {businesses.find(b => b.slug === entry.business_id)?.name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900">{entry.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{entry.summary}</p>

                  {entry.key_insights.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {entry.key_insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 mt-0.5 text-xs">-</span>
                          <p className="text-xs text-gray-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {entry.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {entry.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{tag}</span>
                      ))}
                    </div>
                  )}

                  {entry.source_url && (
                    <a href={entry.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 mt-2">
                      <ExternalLink className="w-3 h-3" /> View source
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

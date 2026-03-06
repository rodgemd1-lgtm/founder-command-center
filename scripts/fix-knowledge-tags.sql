-- Fix knowledge_chunks business_id tagging
-- Problem: 82.6% tagged 'all' because ingest script only matches obvious filenames
-- Solution: Re-tag based on content and filename patterns, and DUPLICATE universal files
-- into each business's namespace so RAG queries scoped to a business find relevant content

-- Step 1: Fix specific file tags that were mis-tagged as 'all'

-- Growth/marketing personas → both TF and VA
UPDATE knowledge_chunks SET business_id = 'transformfit'
WHERE business_id = 'all'
  AND title IN ('growth_hacker_persona', 'social_media_persona', 'instagram_growth_persona', 'email_marketing_persona')
  AND NOT EXISTS (SELECT 1 FROM knowledge_chunks kc2 WHERE kc2.title = knowledge_chunks.title AND kc2.business_id = 'transformfit' AND kc2.chunk_index = knowledge_chunks.chunk_index);

-- Design/UX personas → both TF and VA
UPDATE knowledge_chunks SET business_id = 'transformfit'
WHERE business_id = 'all'
  AND title IN ('ux_design_director_persona', 'ux_expert_persona', 'mobile_ux_persona')
  AND NOT EXISTS (SELECT 1 FROM knowledge_chunks kc2 WHERE kc2.title = knowledge_chunks.title AND kc2.business_id = 'transformfit' AND kc2.chunk_index = knowledge_chunks.chunk_index);

-- AI/engineering personas → intelligence-engine
UPDATE knowledge_chunks SET business_id = 'intelligence-engine'
WHERE business_id = 'all'
  AND title IN ('ai_architect_persona', 'data_engineer_persona', 'agentic_systems_persona', 'mcp_architect_persona')
  AND NOT EXISTS (SELECT 1 FROM knowledge_chunks kc2 WHERE kc2.title = knowledge_chunks.title AND kc2.business_id = 'intelligence-engine' AND kc2.chunk_index = knowledge_chunks.chunk_index);

-- Step 2: Duplicate key universal files into each business namespace
-- This ensures RAG queries scoped to 'transformfit' also find startup_ceo, pricing, etc.

-- For TransformFit: copy relevant 'all' chunks
INSERT INTO knowledge_chunks (user_id, business_id, source_type, source_path, title, content, metadata, chunk_index, embedding, created_at)
SELECT user_id, 'transformfit', source_type, source_path, title, content, metadata, chunk_index, embedding, created_at
FROM knowledge_chunks
WHERE business_id = 'all'
  AND title IN (
    'startup_ceo_persona', 'pricing_strategist_persona', 'finance_analyst_persona',
    'operations_persona', 'startup_lawyer_persona', 'hiring_persona',
    'content_strategist_persona', 'prompt_engineer_persona',
    'stripe_integration_persona', 'app_store_aso_persona',
    'stripe_saas_billing_framework', 'beta_launch_framework', 'prelaunch_checklist_framework',
    'stripe-checkout-setup', 'railway-deployment', 'llc-formation',
    'design-critique', 'design-mockup-generator', 'design-pattern-lookup', 'design-studio-session'
  )
  AND NOT EXISTS (
    SELECT 1 FROM knowledge_chunks kc2
    WHERE kc2.title = knowledge_chunks.title
      AND kc2.business_id = 'transformfit'
      AND kc2.chunk_index = knowledge_chunks.chunk_index
  );

-- For Viral Architect: copy relevant 'all' chunks
INSERT INTO knowledge_chunks (user_id, business_id, source_type, source_path, title, content, metadata, chunk_index, embedding, created_at)
SELECT user_id, 'viral-architect', source_type, source_path, title, content, metadata, chunk_index, embedding, created_at
FROM knowledge_chunks
WHERE business_id = 'all'
  AND title IN (
    'startup_ceo_persona', 'pricing_strategist_persona', 'finance_analyst_persona',
    'operations_persona', 'startup_lawyer_persona', 'hiring_persona',
    'content_strategist_persona', 'prompt_engineer_persona',
    'stripe_integration_persona', 'app_store_aso_persona',
    'meta_platform_compliance_persona',
    'stripe_saas_billing_framework', 'beta_launch_framework', 'prelaunch_checklist_framework',
    'stripe-checkout-setup', 'meta-app-review-submission', 'railway-deployment', 'llc-formation',
    'design-critique', 'design-mockup-generator'
  )
  AND NOT EXISTS (
    SELECT 1 FROM knowledge_chunks kc2
    WHERE kc2.title = knowledge_chunks.title
      AND kc2.business_id = 'viral-architect'
      AND kc2.chunk_index = knowledge_chunks.chunk_index
  );

-- For Intelligence Engine: copy relevant 'all' chunks
INSERT INTO knowledge_chunks (user_id, business_id, source_type, source_path, title, content, metadata, chunk_index, embedding, created_at)
SELECT user_id, 'intelligence-engine', source_type, source_path, title, content, metadata, chunk_index, embedding, created_at
FROM knowledge_chunks
WHERE business_id = 'all'
  AND title IN (
    'startup_ceo_persona', 'pricing_strategist_persona', 'finance_analyst_persona',
    'operations_persona', 'prompt_engineer_persona',
    'ai_architect_persona', 'data_engineer_persona', 'agentic_systems_persona',
    'mcp_architect_persona',
    'stripe_saas_billing_framework', 'beta_launch_framework', 'prelaunch_checklist_framework',
    'stripe-checkout-setup', 'railway-deployment'
  )
  AND NOT EXISTS (
    SELECT 1 FROM knowledge_chunks kc2
    WHERE kc2.title = knowledge_chunks.title
      AND kc2.business_id = 'intelligence-engine'
      AND kc2.chunk_index = knowledge_chunks.chunk_index
  );

-- For Automotive: copy relevant 'all' chunks
INSERT INTO knowledge_chunks (user_id, business_id, source_type, source_path, title, content, metadata, chunk_index, embedding, created_at)
SELECT user_id, 'automotive-os', source_type, source_path, title, content, metadata, chunk_index, embedding, created_at
FROM knowledge_chunks
WHERE business_id = 'all'
  AND title IN (
    'startup_ceo_persona', 'pricing_strategist_persona', 'finance_analyst_persona',
    'operations_persona', 'startup_lawyer_persona',
    'prompt_engineer_persona',
    'stripe_saas_billing_framework', 'beta_launch_framework', 'prelaunch_checklist_framework',
    'stripe-checkout-setup', 'railway-deployment', 'llc-formation'
  )
  AND NOT EXISTS (
    SELECT 1 FROM knowledge_chunks kc2
    WHERE kc2.title = knowledge_chunks.title
      AND kc2.business_id = 'automotive-os'
      AND kc2.chunk_index = knowledge_chunks.chunk_index
  );

-- Step 3: Also update the rag-query edge function's SQL to include 'all' business_id
-- (This is handled in the edge function code, not SQL)
-- The match_knowledge function should be: WHERE business_id = $2 OR business_id = 'all'

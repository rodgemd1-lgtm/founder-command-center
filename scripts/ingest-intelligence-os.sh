#!/bin/bash
# Ingest all Intelligence OS files into Supabase knowledge_chunks via edge function
# This sends each file to the ingest-document edge function which chunks, embeds, and stores it

SUPABASE_URL="https://jmpywetvmcznqfllqkeg.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcHl3ZXR2bWN6bnFmbGxxa2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzYxNjcsImV4cCI6MjA4ODIxMjE2N30.8d1-lvR_1WNzwYSFP1WqcOz1QYwM9eRh6t7hSBkup9I"
INTELLIGENCE_DIR="/Users/mikerodgers/founder-intelligence-os"
FUNCTION_URL="${SUPABASE_URL}/functions/v1/ingest-document"

SUCCESS=0
FAIL=0
SKIP=0
TOTAL=0

# Map file paths to business_id
get_business_id() {
  local filepath="$1"
  local filename=$(basename "$filepath" .md)

  # TransformFit files
  if [[ "$filename" == tf_* ]] || [[ "$filename" == *transformfit* ]] || [[ "$filename" == *fitness* ]]; then
    echo "transformfit"
  # Viral Architect files
  elif [[ "$filename" == va_* ]] || [[ "$filename" == *viral* ]] || [[ "$filename" == *instagram* ]] || [[ "$filename" == *content_algorithm* ]] || [[ "$filename" == *creator* ]]; then
    echo "viral-architect"
  # Automotive files
  elif [[ "$filename" == *automotive* ]] || [[ "$filename" == *auto_repair* ]]; then
    echo "automotive-os"
  # Intelligence Engine files
  elif [[ "$filename" == *competitive_intel* ]] || [[ "$filename" == *intelligence* ]]; then
    echo "intelligence-engine"
  # Universal files - available to all businesses
  else
    echo "all"
  fi
}

# Get source type from directory
get_source_type() {
  local filepath="$1"
  if [[ "$filepath" == *"/personas/"* ]]; then
    echo "persona"
  elif [[ "$filepath" == *"/frameworks/"* ]]; then
    echo "framework"
  elif [[ "$filepath" == *"/skills/"* ]]; then
    echo "skill"
  elif [[ "$filepath" == *"/templates/"* ]]; then
    echo "template"
  else
    echo "document"
  fi
}

echo "=== Intelligence OS Ingestion ==="
echo "Source: $INTELLIGENCE_DIR"
echo "Target: $FUNCTION_URL"
echo ""

# Process all markdown files
for filepath in $(find "$INTELLIGENCE_DIR/intelligence" "$INTELLIGENCE_DIR/automation/skills" -name "*.md" -not -name "_TEMPLATE*" -not -name "INDEX*" -not -name "README*" 2>/dev/null | sort); do
  TOTAL=$((TOTAL + 1))
  filename=$(basename "$filepath" .md)
  business_id=$(get_business_id "$filepath")
  source_type=$(get_source_type "$filepath")

  # Read file content
  content=$(cat "$filepath" 2>/dev/null)
  if [ -z "$content" ]; then
    echo "[$TOTAL] SKIP (empty): $filename"
    SKIP=$((SKIP + 1))
    continue
  fi

  # Truncate very long files to ~8000 chars to stay within embedding limits
  content=$(echo "$content" | head -c 8000)

  # JSON-escape the content
  escaped_content=$(echo "$content" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')

  # Build JSON payload
  payload=$(cat <<ENDJSON
{
  "content": ${escaped_content},
  "title": "${filename}",
  "business_id": "${business_id}",
  "source_type": "${source_type}",
  "source_path": "${filepath#$INTELLIGENCE_DIR/}",
  "user_id": "00000000-0000-0000-0000-000000000001"
}
ENDJSON
)

  # Call the edge function
  response=$(curl -s -w "\n%{http_code}" -X POST "$FUNCTION_URL" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "$payload" 2>&1)

  http_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | head -n -1)

  if [ "$http_code" = "200" ]; then
    SUCCESS=$((SUCCESS + 1))
    echo "[$TOTAL] OK ($business_id/$source_type): $filename"
  else
    FAIL=$((FAIL + 1))
    echo "[$TOTAL] FAIL ($http_code): $filename — $body"
  fi

  # Small delay to avoid rate limiting
  sleep 0.3
done

echo ""
echo "=== Ingestion Complete ==="
echo "Total: $TOTAL | Success: $SUCCESS | Failed: $FAIL | Skipped: $SKIP"

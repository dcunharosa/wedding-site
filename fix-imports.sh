#!/bin/bash
cd "/Users/duarte.rosa/Coding Projects/Wedding Site"

# Fix public-web imports
sed -i '' "s|from '@/components/|from '../components/|g" "apps/public-web/src/app/layout.tsx"
sed -i '' "s|from '@/lib/|from '../lib/|g" "apps/public-web/src/app/layout.tsx"
sed -i '' "s|from '@/components/|from '../components/|g" "apps/public-web/src/app/page.tsx"
sed -i '' "s|from '@/lib/|from '../lib/|g" "apps/public-web/src/app/page.tsx"

# Fix nested pages (need ../../)
for dir in schedule faq gifts venue rsvp; do
  if [ -f "apps/public-web/src/app/$dir/page.tsx" ]; then
    sed -i '' "s|from '@/components/|from '../../components/|g" "apps/public-web/src/app/$dir/page.tsx"
    sed -i '' "s|from '@/lib/|from '../../lib/|g" "apps/public-web/src/app/$dir/page.tsx"
  fi
done

# Fix admin-web imports
sed -i '' "s|from '@/components/|from '../components/|g" "apps/admin-web/src/app/page.tsx"
sed -i '' "s|from '@/lib/|from '../lib/|g" "apps/admin-web/src/app/page.tsx"

for dir in dashboard login; do
  if [ -f "apps/admin-web/src/app/$dir/page.tsx" ]; then
    sed -i '' "s|from '@/components/|from '../../components/|g" "apps/admin-web/src/app/$dir/page.tsx"
    sed -i '' "s|from '@/lib/|from '../../lib/|g" "apps/admin-web/src/app/$dir/page.tsx"
  fi
  # Fix nested dashboard pages
  if [ -d "apps/admin-web/src/app/$dir" ]; then
    for subdir in households audit; do
      if [ -f "apps/admin-web/src/app/$dir/$subdir/page.tsx" ]; then
        sed -i '' "s|from '@/components/|from '../../../components/|g" "apps/admin-web/src/app/$dir/$subdir/page.tsx"
        sed -i '' "s|from '@/lib/|from '../../../lib/|g" "apps/admin-web/src/app/$dir/$subdir/page.tsx"
      fi
      # Fix even deeper nesting
      if [ -d "apps/admin-web/src/app/$dir/$subdir" ]; then
        find "apps/admin-web/src/app/$dir/$subdir" -name "page.tsx" -depth 3 -exec sed -i '' "s|from '@/components/|from '../../../../components/|g" {} \;
        find "apps/admin-web/src/app/$dir/$subdir" -name "page.tsx" -depth 3 -exec sed -i '' "s|from '@/lib/|from '../../../../lib/|g" {} \;
      fi
    done
  fi
done

echo "Imports fixed!"

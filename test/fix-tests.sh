#!/bin/bash

# Array of test configurations: "testname:dirname:samplename:special_mock"
tests=(
    "200-admin:200-admin:Admin Operations Sample:"
    "201-does-database-exist:201-does-database-exist:Does Database Exist Sample:"
    "202-get-doc-count:202-get-doc-count:Get Document Count Sample:"
    "225-get-collection-indexes:225-get-collection-indexes:Get Collection Indexes Sample:"
    "251-bulk_write:251-bulk_write:Bulk Write Sample:"
    "252-insert-many:252-insert-many:Insert Many Sample:"
    "275-find:275-find:Find Sample:"
    "290-delete-doc:290-delete-doc:Delete Document Sample:"
    "299-drop-collection:299-drop-collection:Drop Collection Sample:"
    "300-drop-database:300-drop-database:Drop Database Sample:"
    "280-aggregation-average-price:280-aggregation/average-price-in-each-product-subcategory.js:Aggregation Average Price Sample:"
    "280-aggregation-bike-types:280-aggregation/bike-types-and-price-ranges.js:Aggregation Bike Types Sample:"
)

for test_config in "${tests[@]}"; do
    IFS=':' read -r testname dirname samplename special <<< "$test_config"
    
    echo "Fixing $testname.test.js..."
    
    # Replace the describe block name
    sed -i "s/describe('250-upsert-doc'/describe('$samplename'/" "$testname.test.js"
    
    # Replace the test description
    sed -i "s/should upsert documents/should execute main function successfully/" "$testname.test.js"
    
    # Replace the import path - handle special case for aggregation
    if [[ $dirname == *"/"* ]]; then
        # For aggregation files, use the full path
        sed -i "s|import('../250-upsert-doc/index.js')|import('../$dirname')|" "$testname.test.js"
    else
        # For regular directories, add /index.js
        sed -i "s|import('../250-upsert-doc/index.js')|import('../$dirname/index.js')|" "$testname.test.js"
    fi
    
    # Remove the result verification for main function tests
    sed -i '/\/\/ Verify result/,/expect(result).toBe/d' "$testname.test.js"
    
    # Fix the main function call
    sed -i 's/const result = await main();/await expect(main()).resolves.not.toThrow();/' "$testname.test.js"
    
done

# Special case for 101-client-connection-string (no main function)
echo "Fixing 101-client-connection-string.test.js..."
sed -i "s/describe('250-upsert-doc'/describe('Client Connection String Sample'/" "101-client-connection-string.test.js"
sed -i "s/should upsert documents/should execute script successfully/" "101-client-connection-string.test.js"
sed -i "s|import('../250-upsert-doc/index.js')|import('../101-client-connection-string/index.js')|" "101-client-connection-string.test.js"
sed -i 's/const { main } = await import/await import/' "101-client-connection-string.test.js"
sed -i 's/const result = await main();/\/\/ Script executes on import/' "101-client-connection-string.test.js"
sed -i '/\/\/ Verify result/,/expect(result).toBe/d' "101-client-connection-string.test.js"

echo "All test files fixed!"

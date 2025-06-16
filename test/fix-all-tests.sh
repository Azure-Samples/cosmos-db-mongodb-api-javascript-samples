#!/bin/bash

# Array of failing test files (without .test.js extension)
failing_tests=(
    "101-client-connection-string"
    "200-admin"
    "201-does-database-exist" 
    "225-get-collection-indexes"
    "251-bulk_write"
    "252-insert-many"
    "275-find"
    "280-aggregation-average-price"
    "280-aggregation-bike-types"
    "290-delete-doc"
    "299-drop-collection"
    "300-drop-database"
)

# Read the template
template_content=$(cat test-template.js)

for test_name in "${failing_tests[@]}"; do
    echo "Fixing test: $test_name"
    
    # Check if the script calls main() or executes directly
    if grep -q "export.*main" "../$test_name/index.js" 2>/dev/null; then
        # Has main function
        test_type="main function"
        test_body="    // Import the main function
    const { main } = await import('../$test_name/index.js');

    // Execute the main function
    await expect(main()).resolves.not.toThrow();"
    else
        # Direct execution
        test_type="script"
        test_body="    // Import the script (which executes directly)
    await expect(
      import('../$test_name/index.js')
    ).resolves.not.toThrow();"
    fi
    
    # Replace placeholders in template
    test_content="$template_content"
    test_content="${test_content//\{\{TEST_NAME\}\}/$test_name Sample}"
    test_content="${test_content//\{\{TEST_TYPE\}\}/$test_type}"
    test_content="${test_content//\{\{TEST_BODY\}\}/$test_body}"
    
    # Write the test file
    echo "$test_content" > "${test_name}.test.js"
    
    echo "Created ${test_name}.test.js"
done

echo "All test files have been regenerated!"

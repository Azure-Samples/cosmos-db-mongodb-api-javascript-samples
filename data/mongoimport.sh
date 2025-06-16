#!/bin/bash

# For large documents, use the `mongoimport` tool to import data from a JSON file.
mongoimport --db adventureworks --collection products --file products.json --jsonArray
mongoimport --db adventureworks --collection customers --file customers.json --jsonArray

# Example terminal response for products.json
# 2022-07-27T22:17:00.400+0000    connected to: mongodb://localhost/
# 2022-07-27T22:17:00.471+0000    295 document(s) imported successfully. 0 document(s) failed to import.
#!/bin/bash

# Color Replacement Script for Medical Appointment Frontend
# Replaces blue/cyan/emerald/teal colors with unified green theme

SRC_DIR="/Users/afsa/Desktop/projet_memoire/medical-appointment-frontend/src"

# Initialize counters
declare -A replacement_counts
total_files_modified=0
modified_files=()

# Function to count replacements
count_and_replace() {
    local file="$1"
    local pattern="$2"
    local replacement="$3"
    local color_type="$4"

    # Count occurrences before replacement
    local count=$(grep -o "$pattern" "$file" 2>/dev/null | wc -l | tr -d ' ')

    if [ "$count" -gt 0 ]; then
        # Perform replacement
        sed -i '' "s/$pattern/$replacement/g" "$file"

        # Update counters
        replacement_counts["$color_type"]=$((${replacement_counts["$color_type"]:-0} + count))

        return 0
    fi

    return 1
}

# Function to process a single file
process_file() {
    local file="$1"
    local file_modified=0

    # Blue color replacements (blue-50 to blue-950)
    count_and_replace "$file" "blue-50" "green-50" "blue" && file_modified=1
    count_and_replace "$file" "blue-100" "green-100" "blue" && file_modified=1
    count_and_replace "$file" "blue-200" "green-200" "blue" && file_modified=1
    count_and_replace "$file" "blue-300" "green-300" "blue" && file_modified=1
    count_and_replace "$file" "blue-400" "green-400" "blue" && file_modified=1
    count_and_replace "$file" "blue-500" "green-600" "blue" && file_modified=1
    count_and_replace "$file" "blue-600" "green-700" "blue" && file_modified=1
    count_and_replace "$file" "blue-700" "green-800" "blue" && file_modified=1
    count_and_replace "$file" "blue-800" "green-900" "blue" && file_modified=1
    count_and_replace "$file" "blue-900" "green-950" "blue" && file_modified=1
    count_and_replace "$file" "blue-950" "green-950" "blue" && file_modified=1

    # Cyan color replacements
    count_and_replace "$file" "cyan-50" "green-50" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-100" "green-100" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-200" "green-200" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-300" "green-300" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-400" "green-400" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-500" "green-600" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-600" "green-700" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-700" "green-800" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-800" "green-900" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-900" "green-950" "cyan" && file_modified=1
    count_and_replace "$file" "cyan-950" "green-950" "cyan" && file_modified=1

    # Primary color replacements
    count_and_replace "$file" "primary-50" "green-50" "primary" && file_modified=1
    count_and_replace "$file" "primary-100" "green-100" "primary" && file_modified=1
    count_and_replace "$file" "primary-200" "green-200" "primary" && file_modified=1
    count_and_replace "$file" "primary-300" "green-300" "primary" && file_modified=1
    count_and_replace "$file" "primary-400" "green-400" "primary" && file_modified=1
    count_and_replace "$file" "primary-500" "green-600" "primary" && file_modified=1
    count_and_replace "$file" "primary-600" "green-700" "primary" && file_modified=1
    count_and_replace "$file" "primary-700" "green-800" "primary" && file_modified=1
    count_and_replace "$file" "primary-800" "green-900" "primary" && file_modified=1
    count_and_replace "$file" "primary-900" "green-950" "primary" && file_modified=1
    count_and_replace "$file" "primary-950" "green-950" "primary" && file_modified=1

    # Secondary color replacements
    count_and_replace "$file" "secondary-50" "green-50" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-100" "green-100" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-200" "green-200" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-300" "green-300" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-400" "green-400" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-500" "green-600" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-600" "green-700" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-700" "green-800" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-800" "green-900" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-900" "green-950" "secondary" && file_modified=1
    count_and_replace "$file" "secondary-950" "green-950" "secondary" && file_modified=1

    # Emerald color replacements
    count_and_replace "$file" "emerald-50" "green-50" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-100" "green-100" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-200" "green-200" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-300" "green-300" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-400" "green-400" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-500" "green-600" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-600" "green-700" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-700" "green-800" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-800" "green-900" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-900" "green-950" "emerald" && file_modified=1
    count_and_replace "$file" "emerald-950" "green-950" "emerald" && file_modified=1

    # Teal color replacements
    count_and_replace "$file" "teal-50" "green-50" "teal" && file_modified=1
    count_and_replace "$file" "teal-100" "green-100" "teal" && file_modified=1
    count_and_replace "$file" "teal-200" "green-200" "teal" && file_modified=1
    count_and_replace "$file" "teal-300" "green-300" "teal" && file_modified=1
    count_and_replace "$file" "teal-400" "green-400" "teal" && file_modified=1
    count_and_replace "$file" "teal-500" "green-600" "teal" && file_modified=1
    count_and_replace "$file" "teal-600" "green-700" "teal" && file_modified=1
    count_and_replace "$file" "teal-700" "green-800" "teal" && file_modified=1
    count_and_replace "$file" "teal-800" "green-900" "teal" && file_modified=1
    count_and_replace "$file" "teal-900" "green-950" "teal" && file_modified=1
    count_and_replace "$file" "teal-950" "green-950" "teal" && file_modified=1

    if [ "$file_modified" -eq 1 ]; then
        modified_files+=("$file")
        return 0
    fi

    return 1
}

echo "==================================================="
echo "Color Replacement Script - Medical Appointment App"
echo "==================================================="
echo ""
echo "Processing files in: $SRC_DIR"
echo ""

# Find and process all .jsx, .js, and .css files (excluding backups)
while IFS= read -r -d '' file; do
    if process_file "$file"; then
        ((total_files_modified++))
    fi
done < <(find "$SRC_DIR" -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \) ! -name "*.backup" -print0)

# Print results
echo "==================================================="
echo "Replacement Summary"
echo "==================================================="
echo ""
echo "Total files modified: $total_files_modified"
echo ""
echo "Replacements by color type:"
echo "---------------------------------------------------"
for color in blue cyan primary secondary emerald teal; do
    count=${replacement_counts[$color]:-0}
    if [ "$count" -gt 0 ]; then
        printf "  %-15s: %d replacements\n" "$color" "$count"
    fi
done
echo ""
echo "Total replacements: $(( ${replacement_counts[blue]:-0} + ${replacement_counts[cyan]:-0} + ${replacement_counts[primary]:-0} + ${replacement_counts[secondary]:-0} + ${replacement_counts[emerald]:-0} + ${replacement_counts[teal]:-0} ))"
echo ""
echo "==================================================="
echo "Modified Files"
echo "==================================================="
for file in "${modified_files[@]}"; do
    echo "  ${file#$SRC_DIR/}"
done
echo ""
echo "==================================================="
echo "Replacement Complete!"
echo "==================================================="

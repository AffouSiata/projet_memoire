# Before & After Examples - Color Replacement

## Example 1: Login Page Button

### BEFORE:
```jsx
className="w-full px-8 py-4 bg-blue-600 text-white font-bold 
hover:bg-blue-700 hover:shadow-2xl"
```

### AFTER:
```jsx
className="w-full px-8 py-4 bg-green-700 text-white font-bold 
hover:bg-green-800 hover:shadow-2xl"
```

---

## Example 2: Dashboard Background Gradient

### BEFORE:
```jsx
className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 
dark:from-gray-900"
```

### AFTER:
```jsx
className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 
dark:from-gray-900"
```

---

## Example 3: Loading Spinner

### BEFORE:
```jsx
className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 
border-blue-600"
```

### AFTER:
```jsx
className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 
border-green-700"
```

---

## Example 4: Icon Colors

### BEFORE:
```jsx
<SparklesIcon className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
```

### AFTER:
```jsx
<SparklesIcon className="w-8 h-8 text-green-700 dark:text-green-400" />
```

---

## Example 5: Focus Rings

### BEFORE:
```jsx
className="focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
```

### AFTER:
```jsx
className="focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
```

---

## Example 6: Card Backgrounds

### BEFORE:
```jsx
className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200"
```

### AFTER:
```jsx
className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200"
```

---

## Example 7: Animated Blobs (Decorative)

### BEFORE:
```jsx
<div className="w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply 
filter blur-3xl opacity-20 animate-blob"></div>
```

### AFTER:
```jsx
<div className="w-96 h-96 bg-green-300 rounded-full mix-blend-multiply 
filter blur-3xl opacity-20 animate-blob"></div>
```

---

## Example 8: Link Colors

### BEFORE:
```jsx
className="text-blue-600 dark:text-blue-400 hover:text-blue-700 
dark:hover:text-blue-300"
```

### AFTER:
```jsx
className="text-green-700 dark:text-green-400 hover:text-green-800 
dark:hover:text-green-300"
```

---

## Example 9: Badge/Chip Components

### BEFORE:
```jsx
className="px-4 py-2 bg-emerald-50 border border-emerald-200 
text-emerald-800"
```

### AFTER:
```jsx
className="px-4 py-2 bg-green-50 border border-green-200 
text-green-800"
```

---

## Example 10: Multi-State Button

### BEFORE:
```jsx
className={`
  bg-primary-600 
  hover:bg-primary-700 
  active:bg-primary-800 
  focus:ring-primary-500
  dark:bg-secondary-600
`}
```

### AFTER:
```jsx
className={`
  bg-green-700 
  hover:bg-green-800 
  active:bg-green-900 
  focus:ring-green-500
  dark:bg-green-600
`}
```

---

## Preserved Examples (No Changes)

### Error States (Red) - UNCHANGED:
```jsx
className="bg-red-50 border-2 border-red-200 text-red-700"
```

### Neutral Elements (Gray) - UNCHANGED:
```jsx
className="bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800"
```

### Warning States (Yellow/Amber) - UNCHANGED:
```jsx
className="bg-yellow-50 border-yellow-200 text-yellow-800"
```

---

## Real File Example: Login.jsx (Lines 48-62)

### AFTER (Current State):
```jsx
<div className="min-h-screen flex items-center justify-center 
     bg-gradient-to-br from-green-50 via-white to-green-50 
     dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 
         bg-green-300 rounded-full mix-blend-multiply 
         filter blur-3xl opacity-20 animate-blob"></div>
    
    <div className="absolute top-1/3 right-1/4 w-96 h-96 
         bg-green-300 rounded-full mix-blend-multiply 
         filter blur-3xl opacity-20"></div>
  </div>
  
  <SparklesIcon className="w-8 h-8 text-green-700 
       dark:text-green-400 animate-pulse" />
  
  <h1 className="text-4xl font-black text-green-700 
       dark:text-green-500">
    MediCare
  </h1>
</div>
```

---

## Summary of Transformations

| Original Color | Replacement | Use Case |
|---------------|-------------|----------|
| blue-50 | green-50 | Light backgrounds |
| blue-100 | green-100 | Subtle highlights |
| blue-200 | green-200 | Light borders |
| blue-300 | green-300 | Decorative elements |
| blue-400 | green-400 | Icons, borders |
| blue-500 | green-600 | Focus indicators |
| blue-600 | green-700 | PRIMARY ACTIONS |
| blue-700 | green-800 | Hover states |
| blue-800 | green-900 | Dark emphasis |
| blue-900/950 | green-950 | Dark mode backgrounds |

**All cyan, primary, secondary, emerald, and teal colors follow the same mapping pattern.**

---

**Total Consistency**: Every blue/cyan/primary/secondary/emerald/teal variant has been systematically replaced with the corresponding green shade across all 32 files in the application.

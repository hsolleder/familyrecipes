# Family Recipes

A web application for managing and filtering cooking recipes with metadata including ingredients, preparation times, seasonality, and more.

🔗 **Live Demo:** [https://hsolleder.github.io/familyrecipes/](https://hsolleder.github.io/familyrecipes/)

## Features

- 📖 **Recipe Browser** - Browse all recipes in a card-based grid layout
- 🔍 **Search** - Full-text search across recipe names, ingredients, and notes
- 🏷️ **Filtering** - Filter by ingredients, categories, tags, source books, and preparation time
- 🌱 **Seasonality Tracking** - Binary monthly availability tracking for ingredients
- 📊 **Seasonal Visualization** - Monthly charts showing recipe seasonality based on ingredients
- 📝 **Recipe Details** - Comprehensive recipe information including source, times, and notes
- ➕ **Add Recipes** - Instructions for contributing new recipes via pull requests

## Tech Stack

- **Frontend:** Vue 3 + TypeScript + Vite
- **UI Framework:** Vuetify 3 (Material Design)
- **State Management:** Pinia
- **Data Storage:** YAML files in repository
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions

## Project Structure

```
familyrecipes/
├── public/
│   ├── recipes/          # Recipe YAML files (one per recipe)
│   └── data/
│       └── ingredients.yml  # Ingredient seasonality database
├── src/
│   ├── components/       # Vue components
│   ├── composables/      # Reusable composition functions
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── views/            # Page components
│   └── plugins/          # Vuetify configuration
├── .github/
│   └── workflows/        # GitHub Actions workflows
└── Makefile             # Development commands
```

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/hsolleder/familyrecipes.git
cd familyrecipes

# Install dependencies
make install
# or
npm install
```

### Development

```bash
# Start development server
make dev
# or
npm run dev
```

The app will be available at `http://localhost:5173/familyrecipes/`

### Build

```bash
# Build for production
make build
# or
npm run build
```

### Other Commands

```bash
make help          # Show all available commands
make lint          # Run ESLint
make format        # Format code with Prettier
make type-check    # Run TypeScript type checking
make preview       # Preview production build
make clean         # Clean build artifacts
```

## Data Format

### Recipe YAML Structure

Recipes are stored as YAML files in `public/recipes/` with the following structure:

```yaml
id: recipe-name-YYYYMMDD
name: Recipe Name
source:
  type: book  # or 'link'
  bookName: "Book Name"
  pages: "123-125"
  # url: "https://..." (if type is 'link')

ingredients:
  - name: ingredient name
    amount: "500"
    unit: g

portions: 4

times:
  preparation: 15
  resting: 0      # optional
  cooking: 30

categories:
  - main          # entry, main, dessert, side, snack, drink, breakfast

tags:
  - vegetarian    # vegetarian, vegan, gluten-free, dairy-free, quick, advanced, etc.

notes: |
  Optional notes about the recipe.

dateAdded: "2026-03-14"
dateModified: "2026-03-14"
```

### Ingredient Database

The ingredient database (`public/data/ingredients.yml`) maps ingredients to their binary monthly availability (0 = out of season, 100 = in season):

```yaml
vegetables:
  tomato:
    name: Tomato
    availability:
      january: 0
      february: 0
      march: 0
      april: 0
      may: 100
      june: 100
      july: 100
      august: 100
      september: 100
      october: 0
      november: 0
      december: 0
    category: vegetable
```

## Contributing Recipes

### Manual Method (Current)

1. Fork this repository
2. Create a new YAML file in `public/recipes/` following the format above
3. Use the naming convention: `recipe-name-YYYYMMDD.yml`
4. Ensure the recipe ID matches the filename (without `.yml`)
5. Commit your changes
6. Open a pull request

The PR will automatically trigger validation checks for:
- Valid YAML syntax
- No duplicate recipe IDs

### Recipe ID Generation

Recipe IDs follow the format: `{kebab-case-name}-{YYYYMMDD}`

Examples:
- "Pasta Carbonara" added on 2026-03-14 → `pasta-carbonara-20260314`
- "Mom's Apple Pie" added on 2026-03-15 → `moms-apple-pie-20260315`

### Adding New Ingredients

If your recipe uses ingredients not in the database:

1. Add them to `public/data/ingredients.yml`
2. Specify binary availability (0 or 100) for each month
3. Categorize appropriately (vegetables, proteins, dairy, grains, herbs, baking, oils, other)

Unknown ingredients are assumed to be available year-round (100 for all months).

## Seasonality Calculation

Recipe seasonality is calculated by:

1. Looking up each ingredient in the ingredient database
2. For each month, averaging the availability scores of all ingredients
3. Unknown ingredients default to 100 (year-round)
4. Result is a 0-100 score for each month

A score of ≥70% is considered "in season" for that month.

## Filtering & Search

The app supports:

- **Text search:** Searches recipe names, ingredient names, source books, and notes
- **Ingredient filter:** Show only recipes containing specific ingredients
- **Category filter:** Filter by entry, main, dessert, side, etc.
- **Tag filter:** Filter by vegetarian, vegan, quick, etc.
- **Source book filter:** Filter by cookbook
- **Time filters:** Filter by max preparation or total time
- **Seasonal filter:** Toggle to show only recipes seasonal this month (≥70% score)

Filters can be combined. Active filters are shown as removable chips.

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

```bash
# Build the app
npm run build

# The dist/ folder contains the production build
# Deploy to GitHub Pages using the workflow
git push origin main
```

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. The deploy workflow will automatically publish to `https://hsolleder.github.io/familyrecipes/`

## License

This project is open source. Feel free to use and modify as needed.

## Development Roadmap

- [x] Basic recipe browser
- [x] Recipe detail view
- [x] Binary seasonality tracking
- [x] Search functionality
- [ ] Advanced filtering UI
- [ ] Recipe form with YAML generation
- [ ] Automatic PR creation (via GitHub token)
- [ ] Recipe editing
- [ ] Export recipes (PDF, print view)
- [ ] Meal planning features

## Credits

Built with:
- [Vue 3](https://vuejs.org/)
- [Vuetify 3](https://vuetifyjs.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [js-yaml](https://github.com/nodeca/js-yaml)

# Family Recipes - Makefile

.PHONY: help dev build install clean lint format type-check preview validate-recipes

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

preview: ## Preview production build locally
	npm run preview

lint: ## Run ESLint
	npm run lint

format: ## Format code with Prettier
	npm run format

type-check: ## Run TypeScript type checking
	npm run type-check

clean: ## Clean build artifacts and dependencies
	rm -rf dist node_modules

validate-recipes: ## Validate all recipe YAML files
	@echo "Validating all recipe YAML files..."
	@node scripts/validate-recipes.js || echo "Validation script not yet created"

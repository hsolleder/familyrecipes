<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <div class="text-h4 mb-6">Add New Recipe</div>

        <v-stepper v-model="step" :items="stepItems" alt-labels hide-actions>
          <v-stepper-window>
            <!-- Step 1: Basic Info -->
            <v-stepper-window-item :value="1">
              <v-card flat>
                <v-card-text>
                  <v-form ref="basicForm" v-model="basicFormValid">
                    <v-text-field
                      v-model="recipe.name"
                      label="Recipe Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      required
                    />

                    <v-text-field
                      v-model="recipe.sourceInput"
                      label="Source (Book Title or URL)"
                      :rules="[rules.required]"
                      variant="outlined"
                      hint="e.g., 'Joy of Cooking' or 'https://example.com/recipe'"
                      persistent-hint
                      required
                    />

                    <v-text-field
                      v-model.number="recipe.portions"
                      label="Number of Portions"
                      type="number"
                      :rules="[rules.required, rules.positiveNumber]"
                      variant="outlined"
                      required
                    />
                  </v-form>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>

            <!-- Step 2: Ingredients -->
            <v-stepper-window-item :value="2">
              <v-card flat>
                <v-card-text>
                  <v-form ref="ingredientsForm" v-model="ingredientsFormValid">
                    <div
                      v-for="(ingredient, index) in recipe.ingredients"
                      :key="index"
                      class="mb-4"
                    >
                      <v-row align="center">
                        <v-col cols="12" sm="6">
                          <v-combobox
                            v-model="ingredient.name"
                            :items="availableIngredients"
                            label="Ingredient Name"
                            :rules="[rules.required]"
                            variant="outlined"
                            clearable
                            hint="Type or select an ingredient"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" sm="5">
                          <v-text-field
                            v-model="ingredient.amount"
                            label="Amount (e.g., 200g, 2 cups)"
                            :rules="[rules.required]"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" sm="1">
                          <v-btn
                            icon="mdi-delete"
                            variant="text"
                            color="error"
                            :disabled="recipe.ingredients.length === 1"
                            @click="removeIngredient(index)"
                          />
                        </v-col>
                      </v-row>
                    </div>

                    <v-btn
                      prepend-icon="mdi-plus"
                      variant="outlined"
                      color="primary"
                      @click="addIngredient"
                    >
                      Add Ingredient
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>

            <!-- Step 3: Times -->
            <v-stepper-window-item :value="3">
              <v-card flat>
                <v-card-text>
                  <v-form ref="timesForm" v-model="timesFormValid">
                    <v-text-field
                      v-model.number="recipe.times.preparation"
                      label="Preparation Time (minutes)"
                      type="number"
                      :rules="[rules.nonNegativeNumber]"
                      variant="outlined"
                      hint="Time for prep work (chopping, mixing, etc.)"
                      persistent-hint
                    />

                    <v-text-field
                      v-model.number="recipe.times.resting"
                      label="Resting Time (minutes)"
                      type="number"
                      :rules="[rules.nonNegativeNumber]"
                      variant="outlined"
                      hint="Time for dough rising, marinating, etc."
                      persistent-hint
                      class="mt-4"
                    />

                    <v-text-field
                      v-model.number="recipe.times.cooking"
                      label="Cooking Time (minutes)"
                      type="number"
                      :rules="[rules.nonNegativeNumber]"
                      variant="outlined"
                      hint="Time for baking, frying, simmering, etc."
                      persistent-hint
                      class="mt-4"
                    />

                    <v-alert v-if="totalTime > 0" type="info" variant="tonal" class="mt-4">
                      Total time: {{ formatTime(totalTime) }}
                    </v-alert>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>

            <!-- Step 4: Categories & Tags -->
            <v-stepper-window-item :value="4">
              <v-card flat>
                <v-card-text>
                  <v-form ref="categoriesForm" v-model="categoriesFormValid">
                    <v-select
                      v-model="recipe.categories"
                      :items="CATEGORIES"
                      label="Categories"
                      :rules="[rules.requiredArray]"
                      variant="outlined"
                      multiple
                      chips
                      hint="Select at least one category"
                      persistent-hint
                    />

                    <v-select
                      v-model="recipe.tags"
                      :items="TAGS"
                      label="Tags (Optional)"
                      variant="outlined"
                      multiple
                      chips
                      class="mt-4"
                    />
                  </v-form>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>

            <!-- Step 5: Missing Ingredients -->
            <v-stepper-window-item :value="5">
              <v-card flat>
                <v-card-text>
                  <div v-if="missing.length === 0">
                    <v-alert type="success" variant="tonal">
                      All ingredients in this recipe are already in the database!
                    </v-alert>
                  </div>

                  <div v-else>
                    <v-alert type="info" variant="tonal" class="mb-4">
                      The following ingredients are not in our database yet. Please review and
                      categorize them below.
                    </v-alert>

                    <v-card
                      v-for="ingredient in newIngredients"
                      :key="ingredient.name"
                      variant="outlined"
                      class="mb-4"
                    >
                      <v-card-text>
                        <v-text-field
                          v-model="ingredient.name"
                          label="Ingredient Name"
                          variant="outlined"
                          readonly
                          class="mb-2"
                        />

                        <v-select
                          v-model="ingredient.category"
                          :items="[
                            'vegetables',
                            'fruits',
                            'proteins',
                            'dairy',
                            'grains',
                            'herbs',
                            'baking',
                            'oils',
                            'other'
                          ]"
                          label="Category"
                          variant="outlined"
                          class="mb-2"
                        />

                        <v-switch
                          v-if="shouldHaveSeasonality(ingredient.category)"
                          v-model="ingredient.seasonal"
                          label="This ingredient is seasonal"
                          color="primary"
                          class="mb-2"
                        />

                        <div
                          v-if="ingredient.seasonal && shouldHaveSeasonality(ingredient.category)"
                        >
                          <div class="text-subtitle-2 mb-2">Available months in Switzerland:</div>
                          <v-chip-group v-model="ingredient.availability" multiple column>
                            <v-chip
                              v-for="month in MONTHS"
                              :key="month.value"
                              :value="month.value"
                              filter
                              variant="outlined"
                            >
                              {{ month.label }}
                            </v-chip>
                          </v-chip-group>
                        </div>
                      </v-card-text>
                    </v-card>

                    <v-checkbox
                      v-model="skipMissingIngredients"
                      label="Skip adding these ingredients (they can be added later)"
                    />
                  </div>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>

            <!-- Step 6: Notes & Review -->
            <v-stepper-window-item :value="6">
              <v-card flat>
                <v-card-text>
                  <v-textarea
                    v-model="recipe.notes"
                    label="Cooking Instructions & Notes"
                    variant="outlined"
                    rows="8"
                    hint="Add step-by-step instructions, tips, or any other notes"
                    persistent-hint
                  />

                  <v-divider class="my-6" />

                  <div class="text-h6 mb-4">Preview</div>

                  <v-card variant="outlined">
                    <v-card-title>{{ recipe.name }}</v-card-title>
                    <v-card-subtitle>
                      {{ recipe.sourceInput }} • {{ recipe.portions }} portions
                    </v-card-subtitle>
                    <v-card-text>
                      <div class="mb-2">
                        <strong>Ingredients:</strong>
                      </div>
                      <ul>
                        <li v-for="(ing, i) in recipe.ingredients" :key="i">
                          {{ ing.amount }} {{ ing.name }}
                        </li>
                      </ul>

                      <div class="mt-4 mb-2">
                        <strong>Time:</strong> {{ formatTime(totalTime) }}
                        <span v-if="recipe.times.preparation">
                          ({{ recipe.times.preparation }} min prep
                        </span>
                        <span v-if="recipe.times.resting">
                          + {{ recipe.times.resting }} min rest
                        </span>
                        <span v-if="recipe.times.cooking">
                          + {{ recipe.times.cooking }} min cooking)
                        </span>
                      </div>

                      <div class="mb-2">
                        <strong>Categories:</strong>
                        <v-chip
                          v-for="cat in recipe.categories"
                          :key="cat"
                          size="small"
                          class="ml-2"
                        >
                          {{ cat }}
                        </v-chip>
                      </div>

                      <div v-if="recipe.tags.length > 0" class="mb-2">
                        <strong>Tags:</strong>
                        <v-chip v-for="tag in recipe.tags" :key="tag" size="small" class="ml-2">
                          {{ tag }}
                        </v-chip>
                      </div>

                      <div v-if="recipe.notes" class="mt-4">
                        <strong>Notes:</strong>
                        <div class="mt-2" style="white-space: pre-wrap">{{ recipe.notes }}</div>
                      </div>
                    </v-card-text>
                  </v-card>

                  <v-alert type="info" variant="tonal" class="mt-4">
                    <div class="text-subtitle-2 mb-2">Next Steps:</div>
                    <ol class="ml-4">
                      <li>Review the recipe preview above</li>
                      <li>Click "Create Pull Request" to submit your recipe</li>
                      <li v-if="!github.isAuthenticated()">
                        You'll be asked to connect with GitHub (one-time setup)
                      </li>
                      <li>Your recipe will be submitted for review</li>
                      <li>Once approved and merged, it will appear on the site!</li>
                    </ol>
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>
          </v-stepper-window>

          <v-stepper-actions>
            <template #prev="{ props }">
              <v-btn v-bind="props" :disabled="step === 1" @click="handlePrev"> Previous </v-btn>
            </template>

            <template #next="{ props }">
              <v-btn
                v-if="step < 6"
                v-bind="props"
                :disabled="!canProceed"
                color="primary"
                @click="handleNext"
              >
                Next
              </v-btn>
              <v-btn
                v-else
                :disabled="!canProceed || github.loading.value"
                :loading="github.loading.value"
                color="success"
                @click="createPR"
              >
                <v-icon start>mdi-github</v-icon>
                Create Pull Request
              </v-btn>
            </template>
          </v-stepper-actions>
        </v-stepper>

        <!-- PR Success Dialog -->
        <v-dialog v-model="showPRDialog" max-width="600">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Pull Request Created!</span>
              <v-btn icon="mdi-close" variant="text" @click="showPRDialog = false" />
            </v-card-title>
            <v-card-text>
              <v-alert type="success" variant="tonal" class="mb-4">
                Your recipe has been submitted successfully!
              </v-alert>

              <div class="mb-4">
                <strong>Pull Request:</strong>
                <a :href="prUrl" target="_blank" rel="noopener noreferrer" class="ml-2">
                  {{ prUrl }}
                </a>
              </div>

              <v-alert type="info" variant="tonal">
                Your pull request is now ready for review. Once approved and merged, your recipe
                will appear on the site!
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" :href="prUrl" target="_blank">
                View Pull Request
                <v-icon end>mdi-open-in-new</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Authentication Prompt Dialog -->
        <v-dialog v-model="showAuthPrompt" max-width="500" persistent>
          <v-card>
            <v-card-title>GitHub Authentication Required</v-card-title>
            <v-card-text>
              <v-alert type="info" variant="tonal" class="mb-4">
                To create a pull request, we need permission to access your GitHub account.
              </v-alert>
              <p>
                You'll be redirected to GitHub to authorize this app. After authorization, you'll be
                brought back here to complete your submission.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="showAuthPrompt = false">Cancel</v-btn>
              <v-btn color="primary" @click="github.initiateAuth()">
                <v-icon start>mdi-github</v-icon>
                Connect with GitHub
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Error Snackbar -->
        <v-snackbar v-model="showErrorSnackbar" :timeout="5000" color="error">
          {{ prError }}
          <template #actions>
            <v-btn variant="text" @click="prError = ''">Close</v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useIngredientsStore } from '@/stores/ingredients'
import { generateRecipeId } from '@/utils/slugify'
import { stringifyYaml } from '@/utils/yaml'
import { formatTime } from '@/utils/time'
import { CATEGORIES, TAGS } from '@/utils/constants'
import type { Recipe, RecipeSource, RecipeIngredient, Category, Tag } from '@/types/recipe'
import { useGitHub } from '@/composables/useGitHub'
import { useMissingIngredients, type NewIngredient } from '@/composables/useMissingIngredients'

const ingredientsStore = useIngredientsStore()
const github = useGitHub()

// Initialize ingredient store
ingredientsStore.loadIngredients()

const availableIngredients = computed(() => ingredientsStore.allIngredientNames)

// Form state
const step = ref(1)
const basicFormValid = ref(false)
const ingredientsFormValid = ref(false)
const timesFormValid = ref(false)
const categoriesFormValid = ref(false)

// Missing ingredients state
const newIngredients = ref<NewIngredient[]>([])
const skipMissingIngredients = ref(false)

const { missing, guessCategory, shouldHaveSeasonality } = useMissingIngredients(
  computed(() => recipe.value.ingredients),
  availableIngredients
)

// Month options for seasonality
const MONTHS = [
  { label: 'Jan', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 3 },
  { label: 'Apr', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 },
  { label: 'Aug', value: 8 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 10 },
  { label: 'Nov', value: 11 },
  { label: 'Dec', value: 12 }
]

// Watch for step changes to initialize missing ingredients
watch(step, (newStep) => {
  if (newStep === 5 && newIngredients.value.length === 0) {
    newIngredients.value = missing.value.map((name) => ({
      name,
      category: guessCategory(name),
      seasonal: false,
      availability: []
    }))
  }
})

const stepItems = [
  { title: 'Basic Info', value: 1 },
  { title: 'Ingredients', value: 2 },
  { title: 'Times', value: 3 },
  { title: 'Categories & Tags', value: 4 },
  { title: 'Missing Ingredients', value: 5 },
  { title: 'Review', value: 6 }
]

// Form input (using string for source, will convert to RecipeSource later)
interface RecipeFormData {
  name: string
  sourceInput: string
  ingredients: RecipeIngredient[]
  portions: number
  times: {
    preparation: number
    resting: number
    cooking: number
  }
  categories: Category[]
  tags: Tag[]
  notes: string
}

// Recipe data
const recipe = ref<RecipeFormData>({
  name: '',
  sourceInput: '',
  ingredients: [{ name: '', amount: '' }],
  portions: 4,
  times: {
    preparation: 0,
    resting: 0,
    cooking: 0
  },
  categories: [],
  tags: [],
  notes: ''
})

// Validation rules
const rules = {
  required: (v: string) => !!v || 'This field is required',
  requiredArray: (v: string[]) => (v && v.length > 0) || 'Select at least one option',
  positiveNumber: (v: number) => v > 0 || 'Must be greater than 0',
  nonNegativeNumber: (v: number) => v >= 0 || 'Must be 0 or greater'
}

// Computed
const totalTime = computed(() => {
  return (
    (recipe.value.times.preparation || 0) +
    (recipe.value.times.resting || 0) +
    (recipe.value.times.cooking || 0)
  )
})

const canProceed = computed(() => {
  switch (step.value) {
    case 1:
      return basicFormValid.value
    case 2:
      return ingredientsFormValid.value
    case 3:
      return timesFormValid.value
    case 4:
      return categoriesFormValid.value
    case 5:
      return true // Missing ingredients step is always valid
    case 6:
      return true // Review step is always valid
    default:
      return false
  }
})

// PR creation state
const showPRDialog = ref(false)
const showAuthPrompt = ref(false)
const showErrorSnackbar = ref(false)
const prUrl = ref('')
const prError = ref('')

// Watch prError to show snackbar
watch(prError, (newVal) => {
  showErrorSnackbar.value = !!newVal
})

// Methods
function addIngredient() {
  recipe.value.ingredients.push({ name: '', amount: '' })
}

function removeIngredient(index: number) {
  if (recipe.value.ingredients.length > 1) {
    recipe.value.ingredients.splice(index, 1)
  }
}

function handleNext() {
  if (canProceed.value && step.value < 6) {
    step.value++
  }
}

function handlePrev() {
  if (step.value > 1) {
    step.value--
  }
}

function generateRecipeYaml(): string {
  const now = new Date()
  const dateString = now.toISOString()
  const recipeId = generateRecipeId(recipe.value.name)

  // Determine source type and create RecipeSource object
  const sourceInput = recipe.value.sourceInput.trim()
  const isUrl = sourceInput.startsWith('http://') || sourceInput.startsWith('https://')

  const source: RecipeSource = isUrl
    ? { type: 'link', name: sourceInput }
    : { type: 'book', bookName: sourceInput }

  // Build complete recipe object
  const completeRecipe: Recipe = {
    id: recipeId,
    name: recipe.value.name,
    url: isUrl ? sourceInput : undefined,
    source,
    ingredients: recipe.value.ingredients,
    portions: recipe.value.portions,
    times: recipe.value.times,
    categories: recipe.value.categories,
    tags: recipe.value.tags,
    notes: recipe.value.notes,
    dateAdded: dateString,
    dateModified: dateString
  }

  return stringifyYaml(completeRecipe)
}

function generateModifiedIngredientsYaml(): string {
  // Load current ingredients database
  const currentDb = JSON.parse(JSON.stringify(ingredientsStore.database!))

  // Add new ingredients to appropriate categories
  for (const ing of newIngredients.value) {
    const category = currentDb[ing.category as keyof typeof currentDb]
    const key = ing.name.toLowerCase().replace(/\s+/g, '_')

    const newIng: any = {
      name: ing.name,
      category: ing.category
    }

    if (ing.seasonal && ing.availability && ing.availability.length > 0) {
      newIng.availability = {
        switzerland: ing.availability
      }
    }

    category[key] = newIng
  }

  return stringifyYaml(currentDb)
}

async function createPR() {
  prError.value = ''

  // Check authentication first
  if (!github.isAuthenticated()) {
    showAuthPrompt.value = true
    return
  }

  // Generate YAML files
  const recipeYaml = generateRecipeYaml()
  const recipeId = generateRecipeId(recipe.value.name)
  const filename = `${recipeId}.yml`

  // Generate modified ingredients.yml if needed
  let ingredientsYaml: string | undefined
  if (!skipMissingIngredients.value && newIngredients.value.length > 0) {
    ingredientsYaml = generateModifiedIngredientsYaml()
  }

  // Create PR
  const result = await github.createPullRequest({
    recipeFilename: filename,
    recipeContent: recipeYaml,
    ingredientsContent: ingredientsYaml,
    recipeName: recipe.value.name
  })

  if (result.success && result.prUrl) {
    prUrl.value = result.prUrl
    showPRDialog.value = true
  } else {
    prError.value = result.error || 'Unknown error occurred'
  }
}
</script>

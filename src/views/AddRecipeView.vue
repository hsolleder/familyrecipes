<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <div class="text-h4 mb-6">Add New Recipe</div>

        <v-stepper v-model="step" :items="stepItems" alt-labels>
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
                          <v-autocomplete
                            v-model="ingredient.name"
                            :items="availableIngredients"
                            label="Ingredient Name"
                            :rules="[rules.required]"
                            variant="outlined"
                            clearable
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

            <!-- Step 5: Notes & Review -->
            <v-stepper-window-item :value="5">
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
                      <li>Click "Generate YAML" to create the recipe file</li>
                      <li>Copy the YAML content</li>
                      <li>Create a new file in the repository</li>
                      <li>Submit a pull request</li>
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
                v-if="step < 5"
                v-bind="props"
                :disabled="!canProceed"
                color="primary"
                @click="handleNext"
              >
                Next
              </v-btn>
              <v-btn v-else :disabled="!canProceed" color="success" @click="generateYaml">
                Generate YAML
              </v-btn>
            </template>
          </v-stepper-actions>
        </v-stepper>

        <!-- YAML Output Dialog -->
        <v-dialog v-model="showYamlDialog" max-width="800" persistent>
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Recipe YAML</span>
              <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>
            <v-card-text>
              <v-alert type="success" variant="tonal" class="mb-4">
                Recipe YAML generated successfully!
              </v-alert>

              <div class="mb-2">
                <strong>Filename:</strong>
                <code class="ml-2">{{ yamlFilename }}</code>
              </div>

              <v-textarea
                v-model="yamlContent"
                readonly
                variant="outlined"
                rows="20"
                class="mt-4"
                style="font-family: monospace; font-size: 12px"
              />

              <v-alert type="info" variant="tonal" class="mt-4">
                <div class="text-subtitle-2 mb-2">How to submit this recipe:</div>
                <ol class="ml-4">
                  <li>Copy the YAML content above</li>
                  <li>
                    Go to the
                    <a
                      href="https://github.com/hsolleder/familyrecipes/new/main/public/recipes"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      repository
                    </a>
                  </li>
                  <li>
                    Create a new file named: <code>{{ yamlFilename }}</code>
                  </li>
                  <li>Paste the YAML content</li>
                  <li>Create a pull request with your changes</li>
                </ol>
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="closeDialog">Close</v-btn>
              <v-btn color="primary" @click="copyToClipboard">
                <v-icon start>mdi-content-copy</v-icon>
                Copy YAML
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Success Snackbar -->
        <v-snackbar v-model="showCopySnackbar" :timeout="3000" color="success">
          YAML copied to clipboard!
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIngredientsStore } from '@/stores/ingredients'
import { generateRecipeId } from '@/utils/slugify'
import { stringifyYaml } from '@/utils/yaml'
import { formatTime } from '@/utils/time'
import { CATEGORIES, TAGS } from '@/utils/constants'
import type { Recipe, RecipeSource, RecipeIngredient, Category, Tag } from '@/types/recipe'

const ingredientsStore = useIngredientsStore()

// Initialize ingredient store
ingredientsStore.loadIngredients()

const availableIngredients = computed(() => ingredientsStore.allIngredientNames)

// Form state
const step = ref(1)
const basicFormValid = ref(false)
const ingredientsFormValid = ref(false)
const timesFormValid = ref(false)
const categoriesFormValid = ref(false)

const stepItems = [
  { title: 'Basic Info', value: 1 },
  { title: 'Ingredients', value: 2 },
  { title: 'Times', value: 3 },
  { title: 'Categories & Tags', value: 4 },
  { title: 'Review', value: 5 }
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
      return true
    default:
      return false
  }
})

// YAML generation
const showYamlDialog = ref(false)
const yamlContent = ref('')
const yamlFilename = ref('')
const showCopySnackbar = ref(false)

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
  if (canProceed.value && step.value < 5) {
    step.value++
  }
}

function handlePrev() {
  if (step.value > 1) {
    step.value--
  }
}

function generateYaml() {
  const now = new Date()
  const dateString = now.toISOString()

  // Generate recipe ID
  const recipeId = generateRecipeId(recipe.value.name)
  yamlFilename.value = `${recipeId}.yml`

  // Determine source type and create RecipeSource object
  const sourceInput = recipe.value.sourceInput.trim()
  const isUrl = sourceInput.startsWith('http://') || sourceInput.startsWith('https://')

  const source: RecipeSource = isUrl
    ? { type: 'link', url: sourceInput }
    : { type: 'book', bookName: sourceInput }

  // Build complete recipe object
  const completeRecipe: Recipe = {
    id: recipeId,
    name: recipe.value.name,
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

  // Convert to YAML
  yamlContent.value = stringifyYaml(completeRecipe)
  showYamlDialog.value = true
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(yamlContent.value)
    showCopySnackbar.value = true
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function closeDialog() {
  showYamlDialog.value = false
}
</script>

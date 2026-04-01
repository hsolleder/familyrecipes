import { ref } from 'vue'

// Production Vercel API URL
const VERCEL_API_URL = import.meta.env.VITE_VERCEL_API_URL || 'https://familyrecipes-nu.vercel.app'
const TOKEN_KEY = 'github_token'

export function useGitHub() {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const loading = ref(false)
  const error = ref<string | null>(null)

  function isAuthenticated(): boolean {
    return !!token.value
  }

  function initiateAuth() {
    // Redirect to Vercel OAuth endpoint
    const state = Math.random().toString(36).substring(7)
    window.location.href = `${VERCEL_API_URL}/api/auth?state=${state}`
  }

  function saveToken(newToken: string) {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  function clearToken() {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function createPullRequest(params: {
    recipeFilename: string
    recipeContent: string
    ingredientsContent?: string
    recipeName: string
  }): Promise<{ success: boolean; prUrl?: string; error?: string }> {
    if (!token.value) {
      return { success: false, error: 'Not authenticated' }
    }

    loading.value = true
    error.value = null

    try {
      const branchName = `recipe-${params.recipeFilename.replace('.yml', '')}`
      const commitMessage = `Add recipe: ${params.recipeName}${params.ingredientsContent ? ' and new ingredients' : ''}`
      const prTitle = `Add recipe: ${params.recipeName}`

      let prBody = `## Recipe Submission\n\n`
      prBody += `This PR adds the recipe "${params.recipeName}".\n\n`
      if (params.ingredientsContent) {
        prBody += `### New Ingredients Added\n\n`
        prBody += `This PR also adds new ingredients to the database.\n\n`
      }
      prBody += `---\n_Created via Family Recipes App_`

      const response = await fetch(`${VERCEL_API_URL}/api/create-pr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token.value,
          recipe: {
            filename: params.recipeFilename,
            content: params.recipeContent
          },
          ...(params.ingredientsContent && {
            ingredients: {
              content: params.ingredientsContent
            }
          }),
          branchName,
          commitMessage,
          prTitle,
          prBody
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create PR')
      }

      return {
        success: true,
        prUrl: data.prUrl
      }
    } catch (err: any) {
      error.value = err.message
      return {
        success: false,
        error: err.message
      }
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    loading,
    error,
    isAuthenticated,
    initiateAuth,
    saveToken,
    clearToken,
    createPullRequest
  }
}

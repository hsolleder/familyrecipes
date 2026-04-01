import type { VercelRequest, VercelResponse } from '@vercel/node'

interface CreatePRRequest {
  token: string
  recipe: {
    filename: string
    content: string
  }
  ingredients?: {
    content: string
  }
  branchName: string
  commitMessage: string
  prTitle: string
  prBody: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token, recipe, ingredients, branchName, commitMessage, prTitle, prBody } =
    req.body as CreatePRRequest

  if (!token || !recipe) {
    return res.status(400).json({ error: 'Missing required fields: token and recipe are required' })
  }

  const owner = process.env.GITHUB_REPO_OWNER!
  const repo = process.env.GITHUB_REPO_NAME!
  const baseUrl = 'https://api.github.com'

  try {
    // 1. Get default branch SHA
    const branchResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/git/refs/heads/main`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (!branchResponse.ok) {
      const error = (await branchResponse.json()) as { message: string }
      throw new Error(`Failed to get branch: ${error.message}`)
    }

    const branchData = (await branchResponse.json()) as { object: { sha: string } }
    const baseSha = branchData.object.sha

    // 2. Create new branch
    const createBranchResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: baseSha
      })
    })

    if (!createBranchResponse.ok) {
      const error = (await createBranchResponse.json()) as { message?: string }
      // Branch might already exist, which is okay
      if (error.message && !error.message.includes('already exists')) {
        throw new Error(`Failed to create branch: ${error.message}`)
      }
    }

    // 3. Get current ingredients.yml SHA if we need to modify it
    let ingredientsSha: string | undefined
    if (ingredients) {
      const fileResponse = await fetch(
        `${baseUrl}/repos/${owner}/${repo}/contents/public/data/ingredients.yml?ref=main`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )

      if (fileResponse.ok) {
        const fileData = (await fileResponse.json()) as { sha: string }
        ingredientsSha = fileData.sha
      }
    }

    // 4. Create/update files in the branch
    const files: Array<{
      path: string
      content: string
      sha?: string
    }> = [
      {
        path: `src/recipes/${recipe.filename}`,
        content: recipe.content
      }
    ]

    if (ingredients && ingredientsSha) {
      files.push({
        path: 'public/data/ingredients.yml',
        content: ingredients.content,
        sha: ingredientsSha
      })
    }

    // Commit each file
    for (const file of files) {
      const commitFileResponse = await fetch(
        `${baseUrl}/repos/${owner}/${repo}/contents/${file.path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: commitMessage,
            content: Buffer.from(file.content).toString('base64'),
            branch: branchName,
            sha: file.sha
          })
        }
      )

      if (!commitFileResponse.ok) {
        const error = (await commitFileResponse.json()) as { message: string }
        throw new Error(`Failed to commit file ${file.path}: ${error.message}`)
      }
    }

    // 5. Create pull request
    const prResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: prTitle,
        body: prBody,
        head: branchName,
        base: 'main'
      })
    })

    if (!prResponse.ok) {
      const error = (await prResponse.json()) as { message: string }
      throw new Error(`Failed to create PR: ${error.message}`)
    }

    const prData = (await prResponse.json()) as { html_url: string; number: number }

    return res.status(200).json({
      success: true,
      prUrl: prData.html_url,
      prNumber: prData.number
    })
  } catch (error: any) {
    console.error('Error creating PR:', error)
    return res.status(500).json({
      error: 'Failed to create PR',
      details: error.message
    })
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, state } = req.query

  if (!code) {
    // Initiate OAuth flow (GitHub App)
    const clientId = process.env.GITHUB_CLIENT_ID
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers.host
    const redirectUri = `${protocol}://${host}/api/auth`

    // GitHub Apps don't use scopes - they use fine-grained permissions set during app configuration
    // The permissions (contents:read + pull_requests:write) are already configured in the GitHub App settings
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state || 'random'}`

    return res.redirect(authUrl)
  }

  // Exchange code for token
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    })

    const data = (await tokenResponse.json()) as { access_token?: string; error?: string }

    if (data.access_token) {
      // Redirect back to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      return res.redirect(`${frontendUrl}?github_token=${data.access_token}`)
    } else {
      return res.status(400).json({ error: 'Failed to obtain access token', details: data })
    }
  } catch (error: any) {
    console.error('OAuth error:', error)
    return res.status(500).json({ error: 'OAuth error', details: error.message })
  }
}

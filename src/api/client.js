const API_URL = 'https://api-design-assignment-production.up.railway.app/graphql'

// Bas GraphQL-anrop
async function gql(query, variables = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

// ── AUTH ──────────────────────────────────────────────

export async function loginUser(email, password) {
  const data = await gql(`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user { id email name }
      }
    }
  `, { email, password })
  return data.login
}

export async function registerUser(email, password, name) {
  const data = await gql(`
    mutation Register($email: String!, $password: String!, $name: String!) {
      register(email: $email, password: $password, name: $name) {
        token
        user { id email name }
      }
    }
  `, { email, password, name })
  return data.register
}

// ── GAMES ─────────────────────────────────────────────

export async function getGames({ platform, genre, yearMin, yearMax, limit = 50, offset = 0 } = {}) {
  const data = await gql(`
    query Games($platform: String, $genre: String, $yearMin: Int, $yearMax: Int, $limit: Int, $offset: Int) {
      games(platform: $platform, genre: $genre, yearMin: $yearMin, yearMax: $yearMax, limit: $limit, offset: $offset) {
        id name platform year genre publisher
        globalSales naSales euSales jpSales
      }
    }
  `, { platform: platform || undefined, genre: genre || undefined, yearMin, yearMax, limit, offset })
  return data.games
}

// ── STATS ─────────────────────────────────────────────

export async function getGenres() {
  const data = await gql(`
    query {
      genres {
        name
        totalGames
        averageSales
      }
    }
  `)
  return data.genres
}

export async function getPublishers(limit = 10) {
  const data = await gql(`
    query Publishers($limit: Int) {
      publishers(limit: $limit) {
        name
        totalGames
        totalSales
      }
    }
  `, { limit })
  return data.publishers
}



const API_URL = 


// graph anrop 

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


// auth 

 export async function loginUser (email, password) {
  const data = await gql(`

    mutation login ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token 
      user { id email name }

    }
  }
    `, {email, password})
     
return data.login 
}

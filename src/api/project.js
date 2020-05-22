import axios from 'axios'
export function createProject(formData) {
  const url = 'http://localhost:5000/api/createProject/'
  return axios(url, {
    method: 'POST',
      data: formData
  }).then((res) => {
    return Promise.resolve(res.data)

  })
}

export function createAnalysis(formData){
  // const url = 'http://localhost:5000/api/createAnalysis/'
  const url = 'results.json'
  return axios(url, {
    method: 'POST',
    data: formData
  }).then((res) => {
    return Promise.resolve(res.data)

  })
}

export function getProjects() {
  const url = 'projects.json'
  return axios(url, {
    method:'GET'
  }).then((res) => {
    console.log(res)
    return Promise.resolve(res.data)
  })
}

export function getMostRecent() {
  const url = 'recent.json'
  return axios(url, {
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

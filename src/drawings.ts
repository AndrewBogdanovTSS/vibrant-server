import https from 'https'
import fetch, {Response} from 'node-fetch'
import got from 'got'
import limit from 'simple-rate-limiter'

import {IDrawing} from './types'
import {IncomingMessage} from 'http'

const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1'
const drawings: IDrawing[] = []

const loadDrawing = limit(async (link) => {
  fetch(link).then(async (res: Response) => {
    const data: any = await res.json()
    if (data.primaryImageSmall) {
      drawings.push({id: data.objectID, image: data.primaryImageSmall})
      fetch(data.primaryImageSmall).then(async (res) => {
        const data = await res.blob()
        console.log('data:', data)
      })
    }
  })
})
  .to(1)
  .per(1000)

async function loadDepartment() {
  let data: string = ''
  let obj: {objectIDs: string[]; total: string} = {objectIDs: [], total: '0'}
  let ids: string[] = []
  let links: string[] = []
  // Have to use https module here instead of node-fetch due to an error of API
  const {body} = await got(`${baseUrl}/objects?departmentIds=11`)
  console.log('res:', body)
  /*const req = https.request(`${baseUrl}/objects?departmentIds=11`, (res: IncomingMessage) => {
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      obj = JSON.parse(data)
      ids = obj.objectIDs.slice(0, 3)
      links = ids.map((id: string): string => `${baseUrl}/objects/${id}`)
      links.forEach((link) => loadDrawing(link))
    })
  })
  req.on('error', (e) => {
    console.error(`ERROR： ${e}`)
  })
  req.end()*/
}

export default () => {
  loadDepartment()
}

import got from 'got'
import colorThief from 'colorthief'
import colorNamer from 'color-namer'
import {ParallelLimiter} from 'parallel-limiter'
import {IDrawing, IDrawingResponse} from './types'

const limiter: ParallelLimiter = new ParallelLimiter({maxParallel: 80}) // Setting the limit of concurrent requests
const baseUrl: string = 'https://collectionapi.metmuseum.org/public/collection/v1/objects'

const loadDrawing = async (id: string) => {
  try {
    const {body}: IDrawingResponse = await got(`${baseUrl}/${id}`, {responseType: 'json'})
    if (body?.primaryImageSmall) {
      const image: string = body.primaryImageSmall
      const title: string = body.title
      const color: [] = await colorThief.getColor(image)
      const colorName: string = colorNamer(`rgb(${color.join(',')})`)?.basic[0].name
      const drawing: IDrawing = {
        id,
        title,
        image,
        color,
        colorName
      }
      return drawing
    }
  } catch (err) {
    console.log(err)
  }
}

export default async () => {
  try {
    const {
      body: {objectIDs}
    }: IDrawingResponse = await got(`${baseUrl}?departmentIds=11`, {responseType: 'json'})
    // Getting only 100 items from the collection
    const items: string[] = objectIDs.slice(0, 100)
    return await Promise.all(items.map(async (id: string) => await limiter.schedule(() => loadDrawing(id))))
  } catch (err) {
    console.error(`ERROR: ${err}`)
  }
  return []
}

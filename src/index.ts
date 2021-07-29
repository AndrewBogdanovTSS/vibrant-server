import express, {Request, Response} from 'express'
import cors from 'cors'
import getDrawings from './drawings'

const app = express()
const port = 3001

app.use(cors())

app.get('/drawings', async (req: Request, res: Response) => {
  const drawings = (await getDrawings())?.filter((item) => item != null)
  res.json(drawings)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

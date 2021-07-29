import express, {Request, Response} from 'express'
import getDrawings from './drawings'

const app = express()
const port = 3001

// Forming drawings data
getDrawings()

app.get('/drawings', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

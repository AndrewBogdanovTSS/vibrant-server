export interface IDrawing {
  id: string
  title: string
  image: string
  colorName: string
  color: []
}

export interface IDrawingResponse {
  body: {
    objectIDs: string[]
    title: string
    primaryImageSmall: string
  }
}

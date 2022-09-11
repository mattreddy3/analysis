import _ from "lodash"
import data from "./draft results.json"
import express from "express"
const app = express()
const port = 3000
const safeUpper = (myString) =>
  typeof myString === "string" ? myString.toUpperCase() : ""
let ranks = { RB: 1, QB: 1, TE: 1, DEF: 1, WR: 1, OVR: 1 }
const getRanks = (pos: string): { posRank: number; ovrRank: number } => {
  let posRank = ranks[pos]
  let ovrRank = ranks["OVR"]
  if (!isNaN(posRank)) {
    ranks[pos]++, ranks["OVR"]++
    return { posRank, ovrRank }
  }
  return { posRank: 0, ovrRank: 0 }
}
let orderedResults = data
  .sort((a, b) => +b.metadata.amount - +a.metadata.amount)
  .map((f) => {
    let upperPosition = safeUpper(f.metadata.position)
    let { posRank, ovrRank } = getRanks(upperPosition)
    return {
      ovrRank,
      posRank,
      amount: +f.metadata.amount,
      position: f.metadata.position,
      lastName: f.metadata.last_name,
      firstName: f.metadata.first_name,
    }
  })

let resultsByPosition = _.groupBy(orderedResults, "position")
app.get("/", (req, res) => {
  res.send(orderedResults)
})
app.get("/byPosition", (req, res) => {
  res.send(resultsByPosition)
})
app.get("/byPosition/:position", (req, res) => {
  const { position } = req.params
  let upperPosition = safeUpper(position)
  res.send(resultsByPosition[upperPosition])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

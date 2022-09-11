import lodash from "lodash"
import data from "./draft results.json"
import express from "express"
const app = express()
const port = 3000

let orderedResults = data
  .map((f) => ({
    amount: +f.metadata.amount,
    position: f.metadata.position,
    lastName: f.metadata.last_name,
    firstName: f.metadata.first_name,
  }))
  .sort((a, b) => b.amount - a.amount)

app.get("/", (req, res) => {
  res.send(orderedResults)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

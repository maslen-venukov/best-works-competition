import mongoose from 'mongoose'

const { Schema, model, ObjectId } = mongoose

const schema = new Schema({
  number: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true },
  list: { type: [String] },
  scores: { type: String, required: true },
  expertSheet: { type: ObjectId, ref: 'Expert_Sheet', required: true }
})

export default model('Evaluation_Criterion', schema)
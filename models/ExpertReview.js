import mongoose from 'mongoose'

const { Schema, model, ObjectId } = mongoose

const schema = new Schema({
  evaluationCriterion: { type: ObjectId, ref: 'Evaluation_Criterion', required: true },
  work: { type: ObjectId, ref: 'Work', required: true },
  value: { type: Number, required: true }
}, {
  timestamps: true
})

export default model('Expert_Review', schema)
import mongoose from 'mongoose'

const { Schema, model, ObjectId } = mongoose

const schema = new Schema({
  name: { type: String, required: true },
  file: { type: String, required: true, unique: true },
  nomination: { type: ObjectId, ref: 'Nomination', required: true },
  author: { type: ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

export default model('Work', schema)
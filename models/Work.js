import mongoose from 'mongoose'

const { Schema, model, ObjectId } = mongoose

const schema = new Schema({
  name: { type: String, required: true },
  file: { type: String, required: true, unique: true },
  nomination: { type: ObjectId, ref: 'Nomination', required: true },
  author: { type: ObjectId, ref: 'User', required: true },
  expert: { type: ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false },
  isAdmitted: { type: Boolean, default: false },
  checkDate: { type: Date }
}, {
  timestamps: true
})

export default model('Work', schema)
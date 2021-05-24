import mongoose from 'mongoose'

const { Schema, model, ObjectId } = mongoose

const schema = new Schema({
  surname: { type: String, required: true },
  name: { type: String, required: true },
  patronymic: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'USER' },
  organization: { type: String },
  position: { type: String },
  nomination: { type: ObjectId, ref: 'Nomination' },
  academic_rank: { type: String },
  academic_degree: { type: String }
})

schema.set('toJSON', {
  transform: (_, obj) => {
    delete obj.password
    return ret
  }
})

export default model('User', schema)
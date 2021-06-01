import mongoose from 'mongoose'

const { Schema, model, ObjectId } = mongoose

const schema = new Schema({
  work: { type: ObjectId, ref: 'Work', required: true },
  isAdmitted: { type: Boolean, required: true },
  rejectionReason: { type: String },
  request: { type: Boolean, required: true },
  consentProcessPersonalData: { type: Boolean, required: true },
  advancingLetter: { type: Boolean, required: true },
  expertiseAct: { type: Boolean, required: true },
  coAuthors: { type: Boolean, required: true },
  creativeContributionReference: { type: Boolean, required: true },
  aboutAuthor: { type: Boolean, required: true },
  competitionWork: { type: Boolean, required: true },
  pressRelease: { type: Boolean, required: true },
  annotation: { type: Boolean, required: true },
  additionalMaterials: { type: Boolean, required: true },
  reviews: { type: Boolean, required: true },
  introductionAct: { type: Boolean, required: true },
  electronicVariant: { type: Boolean, required: true },
  notPrizeWinner: { type: Boolean, required: true }
}, {
  timestamps: true
})

export default model('Technical_Expertise', schema)
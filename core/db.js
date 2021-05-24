import mongoose from 'mongoose'

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}

const connect = url => mongoose.connect(url, config).then(() => console.log('MongoDB connected'))

export default connect
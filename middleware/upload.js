import multer, { diskStorage } from 'multer'
import { v4 } from 'uuid'

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const arr = file.originalname.split('.')
    const ext = arr.pop()
    cb(null, `${arr.join('.')}-${v4()}.${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype.includes('application')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const limits = {
  fileSize: 1024 ** 2 * 5
}

const upload = multer({
  storage,
  fileFilter,
  limits
})

export default upload
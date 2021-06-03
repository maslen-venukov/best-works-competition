import multer, { diskStorage } from 'multer'
import { v4 } from 'uuid'

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const { surname, name, patronymic } = req.user

    const fullname = `${surname}-${name[0]}-${patronymic[0]}`
    const workName = req.body.name.trim()
    const extension = file.originalname.split('.').pop()

    const fileName = `${workName}-${fullname}-${v4()}.${extension}`.replace(/ /g, '-')

    cb(null, fileName)
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
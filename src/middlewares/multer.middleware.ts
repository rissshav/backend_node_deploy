const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../', '../', 'public/', 'uploads'),
    filename(req: any, file: any, cb: any) {
        console.log(file,'...')
        let num = Math.round(
            Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10)
        )
            .toString(36)
            .slice(1);
            console.log(num,"num")
        var fileName = num + file.originalname;
        console.log(fileName,"<<<<")
        fileName = fileName.replace(/\s+/g, ' ').trim();
        console.log(fileName)
        cb(null, fileName);
    },
});

const fileFilterDp = function (req: any, file: Express.Multer.File, callback: any) {
    // if (ext !== '.png' && ext !== '.jpg') {
    //     return callback(new Error('Only png and jpg images are allowed'))
    // }
    callback(null, true);
}

export const multerDp = multer({
    storage: storage,
   // limits:{fileSize:maxSize } ,  // { fileSize: 20 * 1048576 }, // 5 mb
    fileFilter: fileFilterDp
});
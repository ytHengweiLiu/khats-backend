// const express = require('express');
// const multer = require('multer');
// const { validateUBL, validatePEPPOL } = require('./runner.js');
// const fs = require("fs").promises;
// const path = require('path'); 
  
// const app = express();
// const port = 3001;

// app.use(express.json());

// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Allowing all origins (not recommended for production)
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true'); // If cookies are needed
//     next();
//   });

// app.get('/', (req, res) => {
//     res.json({
//         msg: `hello world`,
//     });
// });

// const storageConfig = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//         // cb(null, Date.now() + "-" + file.originalname);
//         cb(null, file.originalname);
//     },
// })

// const upload = multer({ storage: storageConfig });


// // Upload invoice --> takes in a file and stores in server until processed:
// // file needs to be XML
// app.post("/invoice-validator/upload-invoice", upload.single("file"), (req, res) => {
//     // check whether req.file contians the file
//     // if not multer is failed to parse so notify the client
//     // console.log(req.file.filename)

//     // if (!req.file) {
//     //     res.status(413).send(`File not uploaded!`);
//     //     return;
//     // }

//     // if (req.file.mimetype !== 'application/xml') {
//     //     res.status(401).send('Only XML files are supported');
//     //     return;
//     // }
//     // if (req.file.size === 0) {
//     //     deleteFile(`uploads/${req.file.filename}`)
//     //     res.status(400).send('File given to upload is empty');
//     //     return;     
//     // }
//     // successfull completion
//     res.status(201).send(`${req.file.filename}`);
//     console.log(req.file.filename)
// });


// app.get("/invoice-validator/validate-invoice" , async (req, res) => {
//     const invoiceCheck = req.query.invoiceTag;
//     console.log(invoiceCheck);

//     fs.readdir('./uploads', (err, files) => { 
//         if (err) 
//           console.log(err); 
//         else { 
//           files.forEach(file => { 
//               console.log(file); 
//           }) 
//         } 
//       }) 
//     try {
//         const [ UBLerror, PEPPOLerror] = await Promise.all([
//             validateUBL(`uploads/${invoiceCheck}`),
//             validatePEPPOL(`uploads/${invoiceCheck}`)
//         ]);
//         res.json({ UBLerror, PEPPOLerror });
//         // Function to get current filenames 
//         // in directory with specific extension
//         deleteFile(`uploads/${invoiceCheck}`)
//     } catch (e) {
//         if (e.code === 'SXJS0006') {
//             res.status(400).send(`${invoiceCheck} does not correspond to any invoice file that was uploaded.`)
//         } else {
//             console.log("err: ", e);
//             res.status(500).json({error: e})
//         }
//     }
// });

// app.listen(port, () => {
//     console.log(`listening to port ${port}`);
// });

// async function deleteFile(filePath) {
//   try {
//     await fs.unlink(filePath);
//     console.log(`File ${filePath} has been deleted.`);
//   } catch (err) {
//     console.error(err);
//   }
// }

const express = require('express');
const multer = require('multer');
const { validateUBL, validatePEPPOL } = require('./runner.js');
const fs = require("fs").promises;
const path = require('path'); 
  
const app = express();
const port = 3001;

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allowing all origins (not recommended for production)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // If cookies are needed
    next();
  });

app.get('/', (req, res) => {
    res.json({
        msg: `hello world`,
    });
});

const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        // cb(null, Date.now() + "-" + file.originalname);
        cb(null, file.originalname);
    },
})

const upload = multer({ 
    storage: storageConfig,
    limits: {
        fileSize: 50 * 1024 * 1024 // Set the file size limit to 50MB (or any desired size)
    }
});

// Upload invoice --> takes in a file and stores in server until processed:
// file needs to be XML
app.post("/invoice-validator/upload-invoice", upload.single("file"), (req, res) => {
    // check whether req.file contians the file
    // if not multer is failed to parse so notify the client
    console.log(req.file);

    if (!req.file) {
        res.status(413).send(`File not uploaded!`);
        return;
    }

    if (req.file.mimetype !== 'text/xml') {
        res.status(401).send('Only XML files are supported');
        return;
    }
    if (req.file.size === 0) {
        deleteFile(`uploads/${req.file.filename}`)
        res.status(400).send('File given to upload is empty');
        return;     
    }
    // successfull completion
    console.log(req.file.filename)
    const fileName = req.file.filename;
    res.status(201).send(`${fileName}`);
});


app.get("/invoice-validator/validate-invoice" , async (req, res) => {
    const invoiceCheck = req.query.invoiceTag;
    console.log(invoiceCheck);

    fs.readdir('./uploads', (err, files) => { 
        if (err) 
          console.log(err); 
        else { 
          files.forEach(file => { 
              console.log(file); 
          }) 
        } 
      }) 
    try {
        const [ UBLerror, PEPPOLerror] = await Promise.all([
            validateUBL(`uploads/${invoiceCheck}`),
            validatePEPPOL(`uploads/${invoiceCheck}`)
        ]);
        res.json({ UBLerror, PEPPOLerror });
        // Function to get current filenames 
        // in directory with specific extension
        deleteFile(`uploads/${invoiceCheck}`)
    } catch (e) {
        if (e.code === 'SXJS0006') {
            res.status(400).send(`${invoiceCheck} does not correspond to any invoice file that was uploaded.`)
        } else {
            console.log("err: ", e);
            res.status(500).json({error: e})
        }
    }
});

app.listen(port, () => {
    console.log(`listening to port ${port}`);
});

async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`File ${filePath} has been deleted.`);
  } catch (err) {
    console.error(err);
  }
}
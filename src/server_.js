const htmlToImage = require('html-to-image');

const node = document.getElementById('card');
node.style.backgroundColor = 'red'

 htmlToImage.toPng()
 .then( (dataUrl) => {
     let img = new Image();
     img.src = dataUrl;
     //res.sendFile(img);
     donwload(dataUrl,"img.png");
     
 }).catch ( (err) => {
     console.log(err);
     res.send("Error");
 })
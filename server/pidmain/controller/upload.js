const { jsonResponse, fileContentType } = require("../helperFunc/handle");
const amazonS3 = require("../integration/awsS3/amazonS3");

async function uploadImage(req, res) {
  if (!req.file) {
    return res.json(jsonResponse("Upload file error", "file"));
  }
  const s3FileName = Date.now() + req.file.originalname;

  amazonS3.upload(
    req.file.path,
    `${req.user.code}/${s3FileName}`,
    async function (resp) {
      const img = `${req.user.code}/${s3FileName}`;
      res.json(jsonResponse({
        url: img,
        name: s3FileName,
      }));
    }
  );
}
async function uploadQRCode(data, thumbnailUrl){
  if(!data){
    return (jsonResponse("Upload file error", "file"));
  }
  const s3FileName = thumbnailUrl;

  amazonS3.uploadFileWithData(
    data,
    `${s3FileName}`,
    async function (resp) {
      const img = `${s3FileName}`;
      return(jsonResponse({
        url: img,
        name: s3FileName,
      }));
    }
  );
}

async function downloadImage(req, res) {
  const fileKey = req.query.fileKey;

  const contentType = fileContentType(fileKey)
  res.set('Content-Type', fileContentType(fileKey));
  if (contentType === 'application/octet-stream') {
    res.attachment(fileKey);
  }
  amazonS3.download(fileKey, function (error) {
    if (!error) return;
    res.status(error.statusCode ?? 404).send(error.code ?? 'error');
    return;
  }).pipe(res);
}

async function downloadShareQR(req, res, fileKey) {

  const contentType = fileContentType(fileKey)
  res.set('Content-Type', fileContentType(fileKey));
  if (contentType === 'application/octet-stream') {
    res.attachment(fileKey);
  }
  amazonS3.download(fileKey, function (error) {
    if (!error) return;
    res.status(error.statusCode ?? 404).send(error.code ?? 'error');
    return;
  }).pipe(res);
}

module.exports = {
  uploadImage,
  downloadImage,
  uploadQRCode,
  downloadShareQR
};

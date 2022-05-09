const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";

const upload = async (req, res) => {
  try {
    console.log("Opa recebi uma requisição, estou olhando!");
    await uploadFile(req, res);

    if (req.files == undefined) {
      return res.status(400).send({ message: "Por favor, faça o upload de um arquivo!" });
    }

    const dados = { ...req.body };

    if (!dados.aitId) {
      return res.status(400).json({ msg: "ID não informado" });
    }

    console.log(dados);
    console.log("Show, bom demais!");

    res.status(200).send({
      message: "Uploads finalizados com sucesso. " ,
      dados
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Erro no upload`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};

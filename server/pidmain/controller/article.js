const { jsonResponse, validateData } = require("../helperFunc/handle");
const articleCol = require("../dataModel/articleCol");
const idCol = require("../dataModel/core/idCol");

async function getAll(req, res) {
    const data = await articleCol.getAll();
    return res.json(data);
}

async function getByAdmin(req, res) {
    const userCode = req.user.code;
    const articles = await articleCol.getByAdmin(userCode);
    return res.json(jsonResponse(articles));
}

async function getOne(req, res) {
    const code = req.params.code;
    const item = await articleCol.getOne(code);
    return res.json(jsonResponse(item));
}

async function create(req, res) {
    const userCode = req.user.code;
    const body = req.body;
    const validateFail = validateData(body, articleCol.createValidateRules);
    if (validateFail) {
        return res.json(jsonResponse("Validate data error", validateFail));
    }
    const article = await articleCol.getOneWithName(body.name);
    if (article) {
        return res.json(jsonResponse("Article already exist"));
    }
    const code = await idCol.getId("article");
    const data = {
        code,
        userCode,
        name: body.name,
        image: body.image,
        description: body.description,
        content: body.content,
    };
    const result = await articleCol.create(data);
    return res.json(jsonResponse(result));
}

async function update(req, res) {
    const code = req.params.code;
    const body = req.body;
    const validateFail = validateData(body, articleCol.createValidateRules);
    if (validateFail) {
        return res.json(jsonResponse("Validate data error", validateFail));
    }
    const data = {
        name: body.name,
    };
    const result = await articleCol.update(code, data);
    return res.json(jsonResponse(result));
}

async function remove(req, res) {
    const code = req.params.code;
    const result = await articleCol.remove(code);
    return res.json(jsonResponse(result));
}

module.exports = {
    getAll,
    getByAdmin,
    getOne,
    create,
    update,
    remove,
};



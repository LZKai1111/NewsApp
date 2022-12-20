const articleCol = require("../dataModel/articleCol");
const commentCol = require("../dataModel/commentCol");
const idCol = require("../dataModel/core/idCol");
const { jsonResponse, validateData } = require("../helperFunc/handle");

async function getAll(req, res) {
    const data = await commentCol.getAll();
    return res.json(data);
}

async function getArticlecomment(req,res){
    const articleCode = req.params.articleCode;
    const comments = await commentCol.getArticlecomment(articleCode);
    return res.json(jsonResponse(comments));
}

async function getOne(req, res) {
    const code = req.params.code;
    const item = await commentCol.getOne(code);
    return res.json(jsonResponse(item));
}

async function create(req, res) {
    const body = req.body;
    const validateFail = validateData(body, commentCol.createValidateRules);
    if (validateFail) {
        return res.json(jsonResponse("Validate data error", validateFail));
    }
    const article = await articleCol.getOne(body.articleCode);
    if (!article) {
        return res.json(jsonResponse("Article not found"));
    }
    const code = await idCol.getId("comment");
    const data = {
        code,
        articleCode: body.articleCode,
        name: body.name,
        userComment: body.userComment,
    }
    const result = await commentCol.create(data);
    return res.json(jsonResponse(result));
}

async function update(req, res) {
    const code = req.params.code;
    const body = req.body;
    const data = {
        name: body.name,
        userComment: body.userComment,
    };
    const result = await commentCol.update(code, data);
    return res.json(jsonResponse(result));
}

async function remove(req, res) {
    const code = req.params.code;
    const result = await commentCol.remove(code);
    return res.json(jsonResponse(result));
}

module.exports = {
    getAll,
    getArticlecomment,
    getOne,
    create,
    update,
    remove,
};
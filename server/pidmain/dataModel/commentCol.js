const { dataPagination, handlePagination } = require("../helperFunc/handle");
const { commentCol } = require("../integration/mongodbCloud/database");

const createValidateRules = ["name", "articleCode"];

async function getAll(){
	const comments = await commentCol().find().toArray();
	return comments;
}

async function getArticlecomment(articleCode){
    const display = await commentCol().find({articleCode}).toArray();
    return display;
}

async function getOne(code) {
	const result = await commentCol().findOne({ code });
	return result;
}

async function create(data) {
    const createData = {
        code: data.code,
        articleCode: data.articleCode,
        name: data.name,
        userComment: data.userComment,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await commentCol().insertOne(createData);
    return result.ops[0];
}

async function update(code, data) {
	const updateData = {
		...data,
		updatedAt: new Date(),
	};
	const result = await commentCol().findOneAndUpdate(
		{ code },
		{ $set: updateData }
	);
	return result.value;
}

async function remove(code) {
	let result = await commentCol().deleteOne({ code });

	return result.value;
}

module.exports = {
    getAll,
    getArticlecomment,
    getOne,
    create,
    update,
    remove,
    createValidateRules,
};
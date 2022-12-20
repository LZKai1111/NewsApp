const { dataPagination, handlePagination } = require("../helperFunc/handle");
const { articleCol } = require("../integration/mongodbCloud/database");

const createValidateRules = ["name"];

async function getAll(){
	const articles = await articleCol().find().toArray();
	return articles;
}

async function getByAdmin(userCode){
	const articles = await articleCol().find({ userCode }).toArray();
	return articles;
}
   
async function getOne(code) {
	const result = await articleCol().findOne({ code });
	return result;
}
async function getOneWithName(name) {
	const result = await articleCol().findOne({ name });
	return result;
}

async function create(data) {
	const createData = {
		code: data.code,
		userCode: data.userCode,
		name: data.name,
        image: data.image,
        description: data.description,
        content: data.content,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await articleCol().insertOne(createData);
	return result.ops[0];
}

async function update(code, data) {
	const updateData = {
		...data,
		updatedAt: new Date(),
	};
	const result = await articleCol().findOneAndUpdate(
		{ code },
		{ $set: updateData }
	);
	return result.value;
}

async function remove(code) {
	let result = await articleCol().deleteOne({ code });

	return result.value;
}

module.exports = {
    getAll,
	getByAdmin,
    getOne,
    getOneWithName,
    create,
    update,
    remove,
    createValidateRules,
};
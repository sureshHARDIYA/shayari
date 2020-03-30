const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const tagSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	}
});

tagSchema.plugin(uniqueValidator);

tagSchema.static('findOneOrCreate', async function findOneOrCreate(condition, doc) {
  const one = await this.findOne(condition);

  return one || this.create(doc);
});

module.exports = mongoose.model('Tag', tagSchema);

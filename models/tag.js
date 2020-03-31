const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const isArray = require("lodash/isArray");

const tagSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

tagSchema.plugin(uniqueValidator);

tagSchema.static("findOneOrCreate", async function findOneOrCreate(
  condition,
  doc
) {
  if (isArray(condition)) {
    const test = condition.map(async item => {
      const one = await this.findOne({ title: item });

      return one || (await this.create({ title: item }));
    });

    return Promise.all(test);
  }

  const one = this.findOne(condition);
  return one || this.create(condition);
});

module.exports = mongoose.model("Tag", tagSchema);

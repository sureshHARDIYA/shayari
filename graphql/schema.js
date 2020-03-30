const { buildSchema } = require('graphql');

const schema = buildSchema(`
	type Query {
		posts: [Post!]!
		post(id: ID!): Post!
		tags: [Tag!]!
		tag(id: ID!): Tag!
	}

	type Post {
		id: ID!
		title: String!
		body: String!
		tags: [Tag!]!
		owner: User!
	}

	type Tag {
		id: ID!
		tag: String!
	}

	type User {
		id: ID!
		name: String
		about: String
		email: String
	}

	type Mutation {
		addPost(title: String!, body: String!): Post!
		updatePost(id: ID!, title: String, body: String): Post!
		deletePost(id: ID!): Post!
		addPostTag(postId: ID!, tagId: ID!): Post!
		removePostTag(postId: ID!, tagId: ID!): Post!
		createTag(tag: String!): Tag!
	}
`);

module.exports = schema;

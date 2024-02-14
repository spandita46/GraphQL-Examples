const graphql = require("graphql");
const axios = require("axios");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const PositionType = new GraphQLObjectType({
  name: "Position",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve: (parentVal, args) => {
        return axios
          .get(`http://localhost:3000/companies/${parentVal.companyId}`)
          .then((resp) => resp.data);
      },
    },
    position: {
      type: PositionType,
      resolve: (parentVal, args) => {
        return axios
          .get(`http://localhost:3000/positions/${parentVal.positionId}`)
          .then((resp) => resp.data);
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve: (parentVal, args) => {
        const { id } = args;
        return axios
          .get(`http://localhost:3000/users/${id}`)
          .then((resp) => resp.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

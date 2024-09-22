const graphql = require("graphql");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => {
    return {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      users: {
        type: new GraphQLList(UserType),
        resolve: (parentVal, args) => {
          console.log(parentVal);
          return axios
            .get(`http://localhost:3000/companies/${parentVal.id}/users`)
            .then((resp) => resp.data);
        },
      },
    };
  },
});

const PositionType = new GraphQLObjectType({
  name: "Position",
  fields: () => {
    return {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      users: {
        type: new GraphQLList(UserType),
        resolve: (parentVal, args) => {
          console.log(parentVal);
          return axios
            .get(`http://localhost:3000/positions/${parentVal.id}/users`)
            .then((resp) => resp.data);
        },
      },
    };
  },
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => {
    return {
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
    };
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
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve: (parentsVal, { id }) => {
        return axios
          .get(`http://localhost:3000/companies/${id}`)
          .then((resp) => resp.data);
      },
    },
    position: {
      type: PositionType,
      args: { id: { type: GraphQLString } },
      resolve: (parentsVal, { id }) => {
        return axios
          .get(`http://localhost:3000/positions/${id}`)
          .then((resp) => resp.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType, // type which resolve function will return;
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        age: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        companyId: {
          type: GraphQLString,
        },
        positionId: {
          type: GraphQLString,
        },
      },
      resolve(parentsVal, { firstName, age, companyId, positionId }) {
        return axios
          .post("http://localhost:3000/users", {
            firstName,
            age,
            companyId,
            positionId,
          })
          .then((res) => res.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((res) => res.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        firstName: {
          type: GraphQLString,
        },
        age: {
          type: GraphQLInt,
        },
        companyId: {
          type: GraphQLString,
        },
        positionId: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, args) {
        // id wont be updated as json server handles that
        return axios
          .patch(`http://localhost:3000/users/${args.id}`, args)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});

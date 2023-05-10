import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String
  }

  type Tweet {
    id: ID!
    text: String!
    author: User!
  }

  # GET 데이터 Request
  type Query {
    allTweets: [Tweet!]!
    # 파라미터를 통해 상세 데이터 지정
    tweet(id: ID!): Tweet
  }

  # POST / PUT / DELETE 데이터 Request
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const server = new ApolloServer({ typeDefs });

server
  .listen()
  .then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });

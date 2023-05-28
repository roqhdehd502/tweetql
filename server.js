import { ApolloServer, gql } from "apollo-server";

// 더미 데이터
let tweets = [
  {
    id: "1",
    text: "Hello",
    userId: "2",
  },
  {
    id: "2",
    text: "Yello",
    userId: "1",
  }
];

let users = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe"
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Musk"
  }
]

// gql에 필요한 쿼리문을 작성
const typeDefs = gql`
  """
  User Object representation
  """
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String
    """
    풀네임
    """
    fullName: String!
  }

  """
  Tweet Object representation
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  """
  가져올 데이터 Request
  """
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    # 파라미터를 통해 상세 데이터 지정
    tweet(id: ID!): Tweet
  }

  """
  변경할 데이터 Request
  """
  type Mutation {
    """
    tweet 생성
    """
    postTweet(text: String!, userId: ID!): Tweet!
    """
    tweet 삭제
    """
    deleteTweet(id: ID!): Boolean!
  }
`;

// DB에 액세스하여 데이터를 반환
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(_, { id }) {
      return tweets.find(tweet => tweet.id === id);
    },
    allUsers() {
      console.log("allUsers Called");
      return users;
    }
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      try {
        const newTweet = {
          id: tweets.length + 1,
          text,
          userId
        };
        tweets.push(newTweet);
        return newTweet;
      } catch (error) {
        console(error); 
      }
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find(tweet => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter(tweet => tweet.id !== id);
      return true;
    }
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName}-${lastName}`;
    }
  },
  Tweet: {
    author({ userId }) {
      return users.find(user => user.id === userId);
    }
  }
}

// 서버(ApolloServer)를 기동
const server = new ApolloServer({ typeDefs, resolvers });

// 서버에 실행에 대해 Callback 함수로 리턴
server
  .listen()
  .then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });

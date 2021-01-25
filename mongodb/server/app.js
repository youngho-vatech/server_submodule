import typeDefs from './graphql/schema/index.js';
import resolvers from './graphql/resolvers/index.js';


import {ApolloServer} from 'apollo-server';

import dbConnect from './models/index.js';

dbConnect();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});


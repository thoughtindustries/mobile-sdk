import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";
import * as SecureStore from "expo-secure-store";

const makeApolloClient = () => {
  const httpLink = createHttpLink({
    uri: `${TI_API_INSTANCE}helium?apiKey=${TI_API_KEY}`,
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await SecureStore.getItemAsync("token");
    return {
      headers: {
        ...headers,
        authToken: token,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return client;
};

export default makeApolloClient;

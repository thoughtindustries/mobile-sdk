import axios from 'axios';
import _ from 'lodash';
import {TI_API_INSTANCE, TI_API_KEY} from '@env';

class TIGraphQL{

    gurl = `${TI_API_INSTANCE}/helium?apiKey=${TI_API_KEY}`;

    goLogin({email,password}){

        const gql =  { 
            query: `mutation Login($email: String!, $password: String!){
                Login(email: $email,password: $password)
            }`, 
            variables: {"email": email, "password": password}
        }
        
        return new Promise((resolve,reject) => {
            axios.post(this.gurl, gql)
            .then((res) => {
                if(_.get(res, 'data.errors.length', 0) > 0){
                    reject(res.data.errors[0].message);
                }else{
                    //console.log('Login token:', res.data.data.Login);
                    resolve(res.data.data.Login);
                }
            })
            .catch(reject);

        });
    
      }
}

export default (new TIGraphQL());
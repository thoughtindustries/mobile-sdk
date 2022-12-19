import axios from 'axios';
import _ from 'lodash';
import {TI_API_INSTANCE, TI_API_KEY} from '@env';
import { UserDetailType } from '../../types';

class TIApi{

    headers(headers = {}){
        return {"headers": {
            'Authorization': 'Bearer ' + TI_API_KEY, 
            ...headers
        }};
    }

    apiUrl(url:string){
        return TI_API_INSTANCE + url;
    }

    userDetails(email:string):Promise<UserDetailType>{

        return new Promise((resolve,reject) => {
            axios.get(this.apiUrl(`/incoming/v2/users/${email}`), this.headers())
            .then((res) => {
                if(_.get(res, 'data.errors.length', 0) > 0){
                    reject(res.data.errors[0].message);
                }else{
                resolve(res.data);
                }
            })
            .catch(reject);

        });

    }


    createUser(userDetail:any):Promise<UserDetailType>{

        const uData = {
            ..._.pick(userDetail,['firstName','lastName','email']),
            "externalCustomerId": userDetail.email,
            "sendInvite": true
        };
        
        return new Promise((resolve,reject) => {
            axios.post(this.apiUrl('/incoming/v2/users'), uData, this.headers())
            .then((res) => {
                if(_.get(res, 'data.errors.length', 0) > 0){
                    reject(res.data.errors[0].message);
                }else{
                resolve(res.data);
                }
            })
            .catch(reject);

        });

    }
}

export default (new TIApi());
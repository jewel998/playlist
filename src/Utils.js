export default class Utils{
    static handleErrors(response){
        if(!response.ok){
            throw new Error(response.status)
        }
        return response;
    }
}
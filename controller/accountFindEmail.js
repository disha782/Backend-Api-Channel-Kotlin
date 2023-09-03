import User from "../dbschema/userdb.js"
class UserDataClass{
    static findUserByEmail(email, callback){
        
        try{
            User.findOne({
                "email":email
            })
            .then((found) =>
            {
                //console.log(found)
                //console.log("then exe")
                // if(found == null)
                // {
                    console.log("if exe")
                    return callback(null, found)
 //               }
            })
            .catch((err) => {
                console.log(err)
                console.log("cathc exe")
                return callback(err, null)
            })
            // if(!data)
            // {
            // return callback(null, data)
            // }
            // else{
            //     console.log("Else Exceuted")
            //     return callback(null, data)
            // }
        }
        catch(err){
            console.log("CATCH")
            return callback(err, null)
        }

        // User.findOne({'email':email}, (err, userdata) => {
        //     if(err)
        //     {
        //         return callback(err, null)
        //     }
        //     else{
        //         return callback(null, userdata)
        //     }
        // })

    }
}
export default UserDataClass
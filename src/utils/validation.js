const validator = require('validator')

const validationSignUp = (req) => {
        const {firstName, lastName, emailID, password} = req.body;

        
        if(!firstName ||!lastName){
           throw new Error("Fullname required")
        }
       else if(!validator.isEmail(emailID)){
                throw new Error("Invalid email")
        }
        else if(!validator.isStrongPassword(password)){
                throw new Error("Enter a strong password")
        }
}

const validateProfileEdit = (req) => {
        const allowedEdit = ["firstName", "lastName", "photoURL", "about", "age", "gender", "skills"];
        const isAllowed = Object.keys(req.body).every((field) => allowedEdit.includes(field))
        return isAllowed;
}

module.exports = {
        validationSignUp,
        validateProfileEdit,
}
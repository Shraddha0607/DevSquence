const validator = require("validator");

const validateSignUpData = (req) => {
    const {
        firstName,
        lastName,
        emailId,
        password
    } = req.body;
    
    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every(field => 
        allowedEditFields.includes(field)
    );

    const {
        firstName,
        lastName,
        emailId,
        photoUrl,
        gender,
        age,
        about,
        skills,
    } = req.body;

    

    if(emailId && !validator.isEmail(emailId)) {
        throw new Error ("Invalid Email Id!");
    }
    else if (photoUrl && !validator.isURL(photoUrl)) {
       throw new Error("Invalid photo url!");
    }
    else if (about && !validator.isLength(about, min = 10, max = 100)) {
        throw new Error("About length must between 10 to 100 characters.");
    }
    else if (skills && skills.length > 10 ) {
        console.log("skills length is"+ req.body.skills.length);
        throw new Error("Skills must upto 10");
    }


    return isEditAllowed;
};

module.exports = {
    validateSignUpData,
    validateEditProfileData
}
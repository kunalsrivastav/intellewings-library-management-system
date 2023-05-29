const validateUserData = (email, password) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,14}$/;
    if (emailRegex.test(email) && passwordRegex.test(password)) {
        return true;
    }
    return false;
}

const validateBookData = (title, author, description, category) => {
    if (title?.length && author?.length && description?.length && category?.length) {
        return true;
    }
    return false;
}

module.exports = {
    validateUserData: validateUserData,
    validateBookData: validateBookData
}
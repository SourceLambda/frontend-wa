export function createUserQuery (userData) {
    const query = `
    mutation {
        createUser(user: {
            email: "${userData.email}"
            password: "${userData.password}"
            role: "${userData.role}"
        })
    }`;

    return query;
}

export function loginUserQuery (userData) {
    const query = `
    mutation {
        loginUser(userlogin: {
            email: "${userData.email}"
            password: "${userData.password}"
        })
    }`;
    
    return query;
}
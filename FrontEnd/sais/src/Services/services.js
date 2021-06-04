export const services = {
    register,
    login,
    getFileList,
    uploadFile
};

function register(email, password, document, name, address){
    let obj = {
        email: email, password: password, document: document, name: name, address: address
    }

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    };

    let url = "http://localhost:8080/users/user/register";

    return fetch(url, requestOptions).then(handleResponse);
}

function uploadFile(filename, file){
    var data = new FormData();
    data.append("file", file);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        },
        body: data
    };

    let url = "http://localhost:8080/files/file/upload/" + filename;

    return fetch(url, requestOptions).then(handleResponse);
}



function login(email, password){
    let obj = {
        email: email, password: password
    }

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    };

    let url = "http://localhost:8080/users/user/login";

    return fetch(url, requestOptions).then(handleResponse);
}

function getFileList(){

    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
        }
    };

    let url = "http://localhost:8080/files/file/list";

    return fetch(url, requestOptions).then(handleResponse);
}


function handleResponse(response) {
    return response.json();
}

export default services;
import axios from 'axios';

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function(method, args, callback, emitPostSignal = true) {
    window.GraphJS.events.emit("before" + ucfirst(method), args);
    var instance = axios.create({
        baseURL: window.GraphJSConfig.host,
        timeout: 20000,
        headers: {
            'Content-Type': 'application/json'
        },
        maxRedirects: 3
    });
    var _call = `/${method}?`;
    for(var key in args) {
        _call += key + '=' + encodeURI(args[key]) + '&';
    }
    _call += 'public_id=' + window.GraphJSConfig.id;
    instance.get(_call, {withCredentials: true})
        .then(function(response) {
            callback(response);
            if(emitPostSignal)
                window.GraphJS.events.emit("after" + ucfirst(method), args);
        })
        .catch(function (error) {
            console.log(error);
        }
    );
};

/* global fetch, localStorage, window */
class Wrapper{

    constructor(){
        this.options = {
            assetsPath: (typeof process != 'undefined') ? process.env.ASSETS_URL+'/apis' : null,
            apiPath: (typeof process != 'undefined') ? process.env.API_URL : null,
            _debug: (typeof process != 'undefined') ? process.env.DEBUG : false,
            getToken: (type='api') => {
                return null;
            },
            onLogout: null
        };
        this.pending = {
            get: {}, post: {}, put: {}, delete: {}
        };
    }
    _logError(error){ if(this.options._debug) console.error(error); }
    setOptions(options){
        this.options = Object.assign(this.options, options);
    }
    fetch(...args){ return fetch(...args); }
    req(method, path, args){

        const token = this.options.getToken((path.indexOf('//assets') == -1) ? 'api':'assets');
        let opts = {
            method,
            cache: "no-cache",
            headers: {'Content-Type': 'application/json'}
        };
        if(token) opts.headers['Authorization'] = token;

        if(method === 'get') path += '?'+this.serialize(args).toStr();
        else
        {
            if((method == 'post' || method == 'put') && !args) throw new Error('Missing request body');
            opts.body = this.serialize(args).toJSON();
        }

        return new Promise((resolve, reject) => {

            if(typeof this.pending[method][path] !== 'undefined' && this.pending[method][path])
                reject({ pending: true, msg: `Request ${method}: ${path} was ignored because a previous one was already pending` });
            else this.pending[method][path] = true;

            this.fetch( path, opts)
                .then((resp) => {
                    this.pending[method][path] = false;
                    if(resp.status == 200) return resp.json();
                    else{
                        this._logError(resp);
                        if(resp.status == 403) reject({ msg: 'Invalid username or password', code: 403 });
                        else if(resp.status == 401){
                            reject({ msg: 'Unauthorized', code: 401 });
                            if(this.options.onLogout) this.options.onLogout();
                        }
                        else if(resp.status == 400)
                            resp.json()
                                .then(data => reject({ msg: data.msg, code: 400 }))
                                .catch(data => reject({ msg: 'Invalid Argument', code: 400 }));

                        else reject({ msg: 'There was an error, try again later', code: 500 });
                    }
                    return false;
                })
                .then((json) => {
                    if(!json) throw new Error('There was a problem processing the request');
                    resolve(json);
                    return json;
                })
                .catch((error) => {
                    this.pending[method][path] = false;
                    this._logError(error.message);
                    reject(error.message);
                });
        });

    }
    _encodeKeys(obj){
        for(let key in obj){
            let newkey = key.replace('-','_');

            let temp = obj[key];
            delete obj[key];
            obj[newkey] = temp;
        }
        return obj;
    }
    _decodeKeys(obj){
        for(let key in obj){
            let newkey = key.replace('_','-');

            let temp = obj[key];
            delete obj[key];
            obj[newkey] = temp;
        }
        return obj;
    }
    post(...args){ return this.req('post', ...args); }
    get(...args){ return this.req('get', ...args); }
    put(...args){ return this.req('put', ...args); }
    delete(...args){ return this.req('delete', ...args); }
    serialize(obj){
        return {
            obj,
            toStr: function(){
                var str = "";
                for (var key in this.obj) {
                    if (str != "") {
                        str += "&";
                    }
                    str += key + "=" + encodeURIComponent(this.obj[key]);
                }
                return str;
            },
            toJSON: function(){
                return JSON.stringify(this.obj);
            }
        };
    }

    credentials(){
        let url = this.options.assetsPath+'/credentials';
        return {
            autenticate: (username, password) => {
                return this.post(url+'/auth', { username, password });
            },
            remind: (username) => {
                return this.post(this.options.apiPath+'/remind/user/'+encodeURIComponent(username), { username });
            }
        };
    }
    syllabus(){
        let url = this.options.assetsPath+'/syllabus';
        return {
            get: (slug) => {
                if(!slug) throw new Error('Missing slug');
                else return this.get(url+'/'+slug);
            }
        };
    }
    todo(){
        let url = this.options.apiPath;
        return {
            getByStudent: (id) => {
                return this.get(url+'/student/'+id+'/task/');
            },
            add: (id, args) => {
                return this.post(url+'/student/'+id+'/task/', args);
            },
            update: (args) => {
                return this.post(url+'/task/'+args.id, args);
            }
        };
    }
    project(){
        let url = this.options.assetsPath;
        return {
            all: (args={}) => {
                return this.get(url+'/project/all', args);
            }
        };
    }
    user(){
        let url = this.options.apiPath;
        return {
            get: (id) => {
                return this.get(url+'/user/'+id);
            },
            all: (args={}) => {
                return this.get(url+'/user/', args);
            },
            add: (args) => {
                return this.put(url+'/user/', args);
            },
            update: (id, args) => {
                return this.post(url+'/user/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/user/'+id);
            }
        };
    }
    catalog(){
        let url = this.options.apiPath;
        return {
            all: (args={}) => {
                return this.get(url+'/catalogs/', args);
            },
            get: (slug=null) => {
                if(!slug) throw new Error('Missing catalog slug');
                return this.get(url+'/catalog/'+slug);
            }
        };
    }
    zap(){
        let url = this.options.assetsPath;
        return {
            all: (args={}) => {
                return this.get(url+'/zap/all', args);
            },
            execute: (slug=null, args=null) => {
                if(!slug || !args) throw new Error('Missing zap slug or body');
                return this.post(url+'/zap/execute/'+slug, args);
            }
        };
    }
    event(){
        let url = this.options.assetsPath;
        this.options.token
        return {
            all: (args={}) => {
                return this.get(url+'/event/all', args);
            },
            get: (id) => {
                return this.get(url+'/event/'+id);
            },
            add: (args) => {
                return this.put(url+'/event/', args);
            },
            update: (id, args) => {
                return this.post(url+'/event/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/event/'+id);
            }
        };
    }
    student(){
        let url = this.options.apiPath;
        let assetsURL = this.options.assetsPath;
        return {
            get: (id) => {
                return this.get(url+'/student/'+id);
            },
            all: (args={}) => {
                return this.get(url+'/students/', args);
            },
            add: (args) => {
                return this.put(assetsURL+'/credentials/signup', args);
            },
            update: (id, args) => {
                return this.post(url+'/student/'+id, args);
            },
            setStatus: (id, args) => {
                return this.post(url+'/student/status/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/student/'+id);
            }
        };
    }
    cohort(){
        let url = this.options.apiPath;
        return {
            all: (args={}) => {
                return this.get(url+'/cohorts/', args);
            },
            get: (id) => {
                return this.get(url+'/cohort/'+id);
            },
            add: (args) => {
                return this.put(url+'/cohort/', args);
            },
            update: (id, args) => {
                return this.post(url+'/cohort/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/cohort/'+id);
            },
            addStudents: (cohortId, studentsArray) => {
                return this.post(url+'/student/cohort/'+cohortId, studentsArray.map(id => {
                    return { student_id: id };
                }));
            },
            removeStudents: (cohortId, studentsArray) => {
                return this.delete(url+'/student/cohort/'+cohortId, studentsArray.map(id => {
                    return { student_id: id };
                }));
            },
            addTeachers: (cohortId, teachersArray) => {
                return this.post(url+'/teacher/cohort/'+cohortId, teachersArray.map(data => {
                    return { teacher_id: data.id, is_instructor: data.is_instructor };
                }));
            },
            removeTeachers: (cohortId, teachersArray) => {
                return this.delete(url+'/teacher/cohort/'+cohortId, teachersArray.map(data => {
                    return { teacher_id: data.id };
                }));
            }
        };
    }
    location(){
        let url = this.options.apiPath;
        return {
            all: (args={}) => {
                return this.get(url+'/locations/', args);
            },
            get: (id) => {
                return this.get(url+'/location/'+id);
            },
            add: (args) => {
                return this.put(url+'/location/', args);
            },
            update: (id, args) => {
                return this.post(url+'/location/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/location/'+id);
            }
        };
    }
    profile(){
        let url = this.options.apiPath;
        return {
            all: (args={}) => {
                return this.get(url+'/profiles/', args);
            },
            get: (id) => {
                return this.get(url+'/profile/'+id);
            },
            add: (args) => {
                return this.put(url+'/profile/', args);
            },
            update: (id, args) => {
                return this.post(url+'/profile/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/profile/'+id);
            }
        };
    }
    lessons(){
        let url = this.options.assetsPath;
        return {
            all: (args={}) => {
                return this.get(url+'/lesson/all', args);
            },
            get: (id) => {
                return this.get(url+'/lessons/'+id);
            }
        };
    }
}
if(typeof module != 'undefined') module.exports = new Wrapper();
window.BC = new Wrapper();
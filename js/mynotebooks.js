let app = {};

let init = (app) =>
{
    app.data =
    {
        user: null, 
        eventHolder: null, 
        tempNote: null, 
        tempNote2: null,
        editing: false,

        notebooks: [], 
        notebooks1: [], 
        notebooks2: [],
        sharedNotebooks: [], 
        
        myNotebooksTab: 0,
    };

    app.addNotebook = () => 
    {
        if(app.vue.editing == false) 
        {
            app.vue.tempNote = 
            { 
                id: null, 
                title: "", 
                description: "", 
                pages: [], 
                editors: [app.vue.user.email], 
                viewers: [app.vue.user.email], 
                star: 0, 
                state: 1 
            };
            app.vue.editing = true;
            app.reindexNotebook();
        }
    };

    app.saveNotebook = () => 
    {
        let tempBook = app.vue.tempNote;

        if(tempBook == null) 
        {
            tempBook = app.vue.tempNote2;
        }

        axios.post(save_notebook, 
        {
            id: tempBook["id"],
            title: tempBook["title"],
            description: tempBook["description"],
            pages: tempBook["pages"],
            editors: tempBook["editors"],
            viewers: tempBook["viewers"],
            star: tempBook["star"],
        
        }).then((result) => 
        {
            app.vue.editing = false;

            if(app.vue.tempNote != null) 
            {
                app.vue.tempNote["id"] = result.data.id;
                app.vue.notebooks.unshift(tempBook);
                app.vue.tempNote = null;
                app.reindexNotebook();
            } 
            else 
            {
                app.vue.editorBook = app.vue.tempNote2;
                app.vue.editorBook.state = 0;
                app.vue.tempNote2 = null;
            }
        
        }).catch(() => 
        {
            console.log("Caught error");
        });
    };

    app.reindexNotebook = () => 
    {
        app.vue.notebooks1 = [];
        app.vue.notebooks2 = [];
        let tempNotebooks = [];

        if(app.vue.myNotebooksTab == 0) 
        {
            tempNotebooks = app.vue.notebooks;
        } 
        else 
        {
            for(var i = 0; i < app.vue.notebooks.length; i++) 
            {
                let someNote = app.vue.notebooks[i];

                if(someNote["star"] == 1) 
                {
                    tempNotebooks.push(someNote);
                }
            }
        }

        if(app.vue.tempNote == null) 
        {
            for(var i = 0; i < tempNotebooks.length; i++) 
            {
                if(i % 2 == 0) 
                {
                    app.vue.notebooks1.push(tempNotebooks[i]);
                } 
                else 
                {
                    app.vue.notebooks2.push(tempNotebooks[i]);
                }
            }
        } 
        else 
        {
            for(var i = 0; i < tempNotebooks.length; i++) 
            {
                if(i % 2 != 0) 
                {
                    app.vue.notebooks1.push(tempNotebooks[i]);
                } 
                else 
                {
                    app.vue.notebooks2.push(tempNotebooks[i]);
                }
            }
        }
    };

    app.getLink = (type, input, force) => 
    {
        if(type == "home")
        {
            return homePageSlash.slice(0,-1);
        }

        if(type == "notebook")
        {
            if(input == undefined) 
            {
                return basePathB + notebook_number;
            }
            else
            {
                return basePath + input;
            }
        }
    };

    app.getValue = (type, object) =>
    {
        if(app.vue != undefined) 
        {
            if(type == "color")
            {
                if(object == 0) 
                {
                    return "is-primary";
                }

                if(object == 1) 
                {
                    return "is-warning";
                }

                if(object == 2) 
                {
                    return "is-danger";
                }
            }

            if(type == "tab")
            {
                if(app.vue.myNotebooksTab == object) 
                {
                    return "is-active";
                }

                return "";
            }

            if(type == "star")
            {
                if(object != null) 
                {
                    if(object["star"] == 1) 
                    {
                        return "is-warning";
                    }
                }

                return "";
            }
        }
    };

    app.setValue = (type, object, value) =>
    {
        if(type == "star")
        {
            if(object != null)
            {
                if(object["star"] == 0)
                {
                    object["star"] = 1;
                }
                else
                {
                    object["star"] = 0;
                }
            }
        }
        
        if(type == "tab")
        {
            app.vue.myNotebooksTab = object;
            app.reindexNotebook();
        }
    };


    app.methods = 
    {
        setValue: app.setValue,
        getValue: app.getValue,
        addNotebook: app.addNotebook, 
        saveNotebook: app.saveNotebook,
        reindexNotebook: app.reindexNotebook,
        getLink: app.getLink,
    };

    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
    });

    app.init = (someNote) => 
    {
        axios.get(user_status).then((result) => 
        {
            if(result.data.userStatus == 1) 
            {
                app.vue.user = [];
                app.vue.user.email = result.data.user.email;
                app.vue.user.firstName = result.data.user.firstName;
                app.vue.user.lastName = result.data.user.lastName;
                app.vue.user.notebooks = result.data.user.notebooks;
                app.vue.user.sharedNotebooks = result.data.user.sharedNotebooks;
            }

            app.vue.notebooks = [];

            for(var i = 0; i < app.vue.user.notebooks.length; i++) 
            {
                axios.post(get_notebook, 
                {
                    id: app.vue.user.notebooks[i],
                
                }).then((result) => 
                {
                    if(result.data.notebook != null) 
                    {
                        app.vue.notebooks.push(result.data.notebook);
                        app.reindexNotebook();
                    }
                })
                .catch(() => 
                {
                    console.log("Caught error");
                });
            }

        }).catch(() =>
        {
            console.log("Caught error");
        });
    };

    app.init(null);
};

init(app);
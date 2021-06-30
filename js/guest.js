let app = {};

let init = (app) => 
{
    app.data = 
    {
        user: null,
        notebooks: [],
        notebooks1: [],
        notebooks2: [],
    };

    app.getLink = (type, input, force) => 
    {
        if (type == "home") 
        {
            return homePageSlash.slice(0, -1);
        }

        if (type == "notebook") 
        {
            if (input == undefined) 
            {
                return basePathB + notebook_number;
            } 
            else 
            {
                return basePath + input;
            }
        }
    };

    app.reindexNotebook = () => 
    {
        app.vue.notebooks1 = [];
        app.vue.notebooks2 = [];
        let tempNotebooks = app.vue.notebooks;

        for (var i = 0; i < tempNotebooks.length; i++) 
        {
            if (i % 2 == 0) 
            {
                app.vue.notebooks1.push(tempNotebooks[i]);
            } 
            else 
            {
                app.vue.notebooks2.push(tempNotebooks[i]);
            }
        }

    };

    app.getValue = (type, object) => 
    {
        if (app.vue != undefined) 
        {
            if (type == "color") 
            {
                if (object == 0) 
                {
                    return "is-primary";
                }

                if (object == 1) 
                {
                    return "is-warning";
                }

                if (object == 2) 
                {
                    return "is-danger";
                }
            }

            if (type == "tab") 
            {
                if (app.vue.myNotebooksTab == object) 
                {
                    return "is-active";
                }

                return "";
            }

            if (type == "shareTab") 
            {
                if (app.vue.shareTab == object) 
                {
                    return "is-active";
                }

                return "";
            }

            if (type == "star") 
            {
                if (object != null) 
                {
                    if (object["star"] == 1) 
                    {
                        return "is-warning";
                    }
                }

                return "";
            }
        }
    };

    app.methods = 
    {
        getLink: app.getLink,
        getValue: app.getValue,
    };

    app.vue = new Vue(
    {
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
    });

    app.init = () => 
    {
        let notebookList = [16,10,9,8,7,6,5,4,3,1];

        if (user_status == null) 
        {
            app.vue.user = null;
        } 
        else 
        {
            axios.get(user_status).then((result) => 
            {
                if (result.data.userStatus == 1) 
                {
                    app.vue.user = [];
                    app.vue.user.email = result.data.user.email;
                    app.vue.user.firstName = result.data.user.firstName;
                    app.vue.user.lastName = result.data.user.lastName;
                    app.vue.user.notebooks = result.data.user.notebooks;
                    app.vue.user.sharedNotebooks = result.data.user.sharedNotebooks;
                }

            }).catch(() => 
            {
                console.log("Caught error");
            });
        }

        axios.post(get_notebooks, 
        {
            ids: notebookList,

        }).then((result) => 
        {
            if (result.data.notebooks != null) 
            {
                app.vue.notebooks = result.data.notebooks;
                app.reindexNotebook();
            }

            app.vue.showText = true;
        
        }).catch(() => 
        {
            app.vue.showText = true;
            console.log("Caught error");
        });

    };

    app.init();
};

init(app);
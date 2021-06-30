let app = {};

let init = (app) =>
{
    app.data =
    {
        user: null,
    };

    app.getLink = (type, input, force) => 
    {
        if(type == "home")
        {
            return homePageSlash.slice(0,-1);
        }
    };

    app.methods = 
    {
        getLink: app.getLink
    };

    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
    });

    app.init = () => 
    {
        if(user_status == null)
        {
            app.vue.user=null;
        }
        else
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

            }).catch(() => 
            {
                console.log("Caught error");
            });
        }
    };

    app.init();
};

init(app);
let app = {};

let init = (app) => 
{
    app.data = 
    {
        user: null,
        eventHolder: null,
        shareSheet: null,
        tempNote: null,
        tempNote2: null,
        editing: false,
        showText: false,
        notebooks: [],
        notebooks1: [],
        notebooks2: [],
        sharedNotebooks: [],
        myNotebooksTab: 0,
        shareTab: 1,
        modalValue: "",
        modalTitle: "",
        modalTask: 0,
        modalPeople: "",
    };

    app.addNotebook = () => 
    {
        if (app.vue.editing == false) 
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

        if (tempBook == null) 
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

            if (app.vue.tempNote != null) 
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
        app.vue.sharedNotebooks = [];
        let tempNotebooks = [];

        if (app.vue.myNotebooksTab == 0) 
        {
            tempNotebooks = app.vue.notebooks;

        } else {
            for (var i = 0; i < app.vue.notebooks.length; i++) 
            {
                let someNote = app.vue.notebooks[i];

                if (htmlPage == "sharednotebooks") 
                {
                    if (someNote["owner"] == app.vue.user.email) 
                    {
                        tempNotebooks.push(someNote);
                    }
                } 
                else 
                {
                    if (someNote["star"] == 1) 
                    {
                        tempNotebooks.push(someNote);
                    }
                }
            }
        }

        if (app.vue.tempNote == null) 
        {
            for (var i = 0; i < tempNotebooks.length; i++) 
            {
                if (app.vue.user != null && tempNotebooks[i].editors != null) 
                {
                    if (tempNotebooks[i].editors.indexOf(app.vue.user.email) >= 0) 
                    {
                        app.vue.sharedNotebooks.push(tempNotebooks[i]);
                    }
                } 
                else if (tempNotebooks[i].editors == null) 
                {
                    app.vue.sharedNotebooks.push(tempNotebooks[i]);
                }

                if (i % 2 == 0) 
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
            for (var i = 0; i < tempNotebooks.length; i++) 
            {
                if (app.vue.user != null && tempNotebooks[i].editors != null) 
                {
                    if (tempNotebooks[i].editors.indexOf(app.vue.user.email) >= 0) 
                    {
                        app.vue.sharedNotebooks.push(tempNotebooks[i]);
                    }
                } 
                else if (tempNotebooks[i].editors == null) 
                {
                    app.vue.sharedNotebooks.push(tempNotebooks[i]);
                }

                if (i % 2 != 0) 
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
        if (type == "home") 
        {
            return homePageSlash.slice(0, -1);
        }

        if (type == "publicnotebooks") 
        {
            window.location.href = publicPath;
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

    app.setValue = (type, object, value) => 
    {
        if (type == "star") 
        {
            if (object != null) 
            {
                if (object["star"] == 0) 
                {
                    object["star"] = 1;
                } 
                else 
                {
                    object["star"] = 0;
                }
            }
        }

        if (type == "tab") 
        {
            app.vue.myNotebooksTab = object;
            app.reindexNotebook();
        }
    };

    app.setModal = (value) => 
    {
        if (value == 0) 
        {
            Object.entries(app.vue.shareSheet["notebooks"]).forEach(([key, value]) => 
            {
                var checkBox = document.getElementById(key + "");
                checkBox.checked = false;
            });

            app.vue.modalValue = "";
            app.vue.shareSheet = null;
            app.vue.modalPeople = "";

        } 
        else if (value == 1) 
        {
            app.vue.modalValue = "is-active";
            app.vue.shareSheet = [];

            app.vue.modalPeople = "";

            app.vue.shareSheet["notebooks"] = [];
            app.vue.shareTab = 1;
        } 
        else 
        {
            let tempList = [];

            Object.entries(app.vue.shareSheet["notebooks"]).forEach(([key, value]) => 
            {
                if (value == true) 
                {
                    tempList.push(key.slice(1))
                }
            });

            let tempBool = false;
            if (htmlPage == "mynotebooks")
            {
                tempBool = true;
            }

            axios.post(share_notebooks, 
            {
                notebooks: tempList,
                shareTab: app.vue.shareTab,
                people: app.vue.modalPeople,
                isOwner: tempBool,

            }).then((result) => 
            {
                if (htmlPage == "mynotebooks")
                    window.location.href = thisPath;

            }).catch(() => 
            {
                console.log("Caught error with share request");
            });

            app.vue.modalValue = "";
            app.vue.modalPeople = "";
            app.vue.shareSheet = null;
        }
    };

    app.setShare = (type, id, value) => 
    {
        if (type == "checkbox") 
        {
            var checkBox = document.getElementById(id);
            app.vue.shareSheet["notebooks"][id] = checkBox.checked;
        }

        if (type == "permission") 
        {
            app.vue.shareTab = value;
        }
    };


    app.methods = 
    {
        getLink: app.getLink,
        setValue: app.setValue,
        setModal: app.setModal,
        getValue: app.getValue,
        setShare: app.setShare,
        addNotebook: app.addNotebook,
        saveNotebook: app.saveNotebook,
        reindexNotebook: app.reindexNotebook,
    };

    app.vue = new Vue(
    {
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
    });

    app.init = (someNote) => 
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

            app.vue.notebooks = [];
            let notebookList = app.vue.user.notebooks;

            if (htmlPage == "sharednotebooks") 
            {
                notebookList = app.vue.user.sharedNotebooks;
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

        }).catch(() =>
        {
            console.log("Caught error");
        });
    };

    app.init(null);
};

init(app);
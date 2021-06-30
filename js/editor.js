let app = {};

let init = (app) => 
{
    app.data = 
    {
        user: null,
        editorBook: null,
        tempNote: null,
        tempNote2: null,
        editing: false,
        canEdit: false,
        canView: false,
        showText: false,
        notePages: [],
        myNotebooksTab: 0,
        modalValue: "",
        modalTitle: "",
        modalBody: "",
        modalFooter: "",
        modalTask: 0,
        htmlPage: htmlPage,
    };

    app.editNotebook = () => 
    {
        if (app.vue.editing == false) 
        {
            app.vue.editorBook.state = 1;
            app.vue.tempNote2 = 
            {
                id: app.vue.editorBook.id,
                title: app.vue.editorBook.title,
                description: app.vue.editorBook.description,
                pages: app.vue.editorBook.pages,
                editors: app.vue.editorBook.editors,
                viewers: app.vue.editorBook.viewers,
                star: app.vue.editorBook.star,
                state: 1,
            };
            app.vue.editing = true;
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

    app.deleteNotebook = () => 
    {
        axios.post(delete_notebook, 
        {
            id: app.vue.editorBook.id,
        })
        .then((result) => 
        {
            window.location.href = myNotebookPath;
        
        }).catch(() => 
        {
            console.log("Caught error");
        });
    };

    app.addNotePage = () => 
    {
        if (app.vue.editing == false) 
        {
            app.vue.tempNote = 
            {
                id: null,
                title: "",
                notes: [],
                type: 0,
                star: 0,
                state: 1
            };

            app.vue.editing = true;
        }
    };

    app.saveNotePage = () => 
    {
        let tempPage = null;

        if (app.vue.tempNote == null) 
        {
            tempPage = app.vue.tempNote2;
        } 
        else 
        {
            app.vue.tempNote.type = app.vue.myNotebooksTab;
            tempPage = app.vue.tempNote;
        }

        axios.post(save_note_page, 
        {
            id: tempPage["id"],
            notebookId: app.vue.editorBook.id,
            title: tempPage["title"],
            type: tempPage["type"],
            notes: tempPage["notes"],
            star: tempPage["star"],
        
        }).then((result) => 
        {
            app.vue.editing = false;

            if (app.vue.tempNote == null) 
            {
                app.vue.editorPage = app.vue.tempNote2;
                app.vue.editorPage.state = 0;
                app.vue.tempNote2 = null;
            } 
            else 
            {
                app.vue.tempNote["id"] = result.data.id;
                app.vue.notePages.push(tempPage);
                app.vue.tempNote = null;
            }
        
        }).catch(() => 
        {
            console.log("Caught error");
        });
    };

    app.getLink = (type, input, force) => 
    {
        if (type == "home") 
        {
            return homePageSlash.slice(0, -1);
        } 
        else if (type == "page") 
        {
            if (force == 2) 
            {
                return basePathG + "?respondtype=" + respond_type + "&amp;notebook=" + notebook_number + "&amp;notepage=" + note_page_number + "&amp;page=All";
            }

            if (input < 1) 
            {
                return basePathG + "?respondtype=" + respond_type + "&amp;notebook=" + notebook_number + "&amp;notepage=" + note_page_number + "&amp;page=1";
            }

            if (app.vue != undefined) 
            {
                if (force == 0 && input > app.vue.pageNumbers.length) 
                {
                    return basePathG + "?respondtype=" + respond_type + "&amp;notebook=" + notebook_number + "&amp;notepage=" + note_page_number + "&amp;page=All";
                }
            }

            return basePathG + "?notebook=" + notebook_number + "&amp;notepage=" + note_page_number + "&amp;page=" + input;
        } 
        else if (type == "notePage") 
        {
            if (app.vue != undefined) 
            {
                if (input["type"] == 0) 
                {
                    //Notes
                    return basePathN + "?respondtype=" + respond_type + "&amp;notebook=" + notebook_number + "&amp;notepage=" + input["id"] + "&amp;page=1";
                } 
                else if (input["type"] == 1) 
                {
                    //Flashcards
                    return basePathF + "?respondtype=" + respond_type + "&amp;notebook=" + notebook_number + "&amp;notepage=" + input["id"] + "&amp;page=1";
                } 
                else if (input["type"] == 2) 
                {
                    //Grammar
                    return basePathG + "?respondtype=" + respond_type + "&amp;notebook=" + notebook_number + "&amp;notepage=" + input["id"] + "&amp;page=1";
                } 
                else if (input["type"] == 3) 
                {
                    //Vocabulary
                    return basePathV + "?respondtype=" + respond_type + "&amp;notebook=" + notebook_number + "&amp;notepage=" + input["id"] + "&amp;page=1";
                }
            }
            return "";
        }

        if (type == "notebook") 
        {
            if (input == undefined) 
            {
                if (respond_type == 1) 
                {
                    return basePath1 + notebook_number;
                } 
                else if (respond_type == 2) 
                {
                    return basePath2 + notebook_number;
                } 
                else if (respond_type == 3) 
                {
                    return basePath3 + notebook_number;
                }
            }
        }

        if (type == "notebook") 
        {
            if (input != undefined) 
            {
                if (respond_type == 1) 
                {
                    return basePath1 + input;
                } 
                else if (respond_type == 2) 
                {
                    return basePath2 + input;
                } 
                else if (respond_type == 3) 
                {
                    return basePath3 + input;
                }
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

            if (type == "pageNav") 
            {
                if (object == page_number) 
                {
                    return "";
                }

                return "is-white";
            }

            if (type == "page") 
            {
                if (object["type"] == 0) 
                {
                    return "N";
                } 
                else if (object["type"] == 1) 
                {
                    return "F";
                } 
                else if (object["type"] == 2) 
                {
                    return "G";
                } 
                else if (object["type"] == 3) 
                {
                    return "V";
                }

                return "X";
            }

            if (type == "state") 
            {
                if (app.vue.mobileState == 0) 
                {
                    return "is-right";
                }

                return "is-left";
            }

            if (type == "tab") 
            {
                if (app.vue.myNotebooksTab == object) 
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
        if (type == "event") {
            app.vue.eventHolder = object;
        } 
        else if (type == "star") 
        {
            if (object != null) 
            {
                if (object["star"] == 0) 
                {
                    object["star"] = 1;
                } else {
                    object["star"] = 0;
                }
            }
        } 
        else if (type == "tab") 
        {
            app.vue.myNotebooksTab = object;
        } 
        else if (type == "note") 
        {
            let p = app.vue.notes[object - 1];
            p.level = value;
        } 
        else if (type == "button1") 
        {
            //Unused
            let p = app.vue.notes[object - 1];
            p.showButton1 = value;
        } 
        else if (type == "button2") 
        {
            let p = app.vue.notes[object - 1];
            p.showButton2 = value;
        }
    };

    app.setModal = (value) => 
    {
        if (value == 0) 
        {
            app.vue.modalValue = "";
            app.vue.modalTitle = "";
            app.vue.modalBody = "";
            app.vue.modalFooter = "";
            app.vue.modalTask = value;
        } 
        else if (value == 1) 
        {
            app.vue.modalValue = "is-active";
            app.vue.modalTitle = "Import Notebook";
            app.vue.modalBody = "Please select a file that contains the notebook data."; 
            app.vue.modalFooter = "Warning: Importing will overwrite all data.\nMake sure to use an exported notebook from this site.";
            app.vue.modalTask = value;
            app.vue.eventHolder = null;
        } 
        else if (value == 2) 
        {
            app.vue.modalValue = "is-active";
            app.vue.modalTitle = "Export Notebook";
            app.vue.modalBody = "A file with the notebook data will be downloaded.";
            app.vue.modalFooter = "";
            app.vue.modalTask = value;
        } 
        else if (value == 3) 
        {
            app.vue.modalValue = "is-active";
            app.vue.modalTitle = "Delete Notebook";
            app.vue.modalBody = "Removing all data about this notebook.";
            app.vue.modalFooter = "Warning: No recovery methods.";
            app.vue.modalTask = value;
        } 
        else if (value == 4) 
        {
            app.vue.modalValue = "is-active";
            app.vue.modalTitle = "Remove Notebook";
            app.vue.modalBody = "This will only remove the notebook from your list. Others will still have access.";
            app.vue.modalFooter = "Warning: The notebook will be deleted if all editors/viewers remove it.";
            app.vue.modalTask = value;
        } 
        else {
            if (app.vue.modalTask == 1) 
            {
                app.importNotebook();
            } 
            else if (app.vue.modalTask == 2) 
            {
                app.exportNotebook();
            } 
            else if (app.vue.modalTask == 3) 
            {
                app.deleteNotebook();
            } 
            else if (app.vue.modalTask == 4) 
            {
                app.removeNotebook();
            }

            app.vue.modalValue = "";
            app.vue.modalTitle = "";
            app.vue.modalBody = "";
            app.vue.modalFooter = "";
            app.vue.modalTask = 0;
        }
    };

    app.getBookTitle = () => 
    {
        if (app.vue != undefined) 
        {
            if (app.vue.showText) 
            {
                if (app.vue.user == null && !app.vue.canView) 
                {
                    return "Login to view";
                }

                if (app.vue.editorBook != null && !app.vue.canView) 
                {
                    return "No view or edit access to this notebook";
                }

                if (app.vue.editorBook == null) 
                {
                    return "404 notebook not found";
                }

                if (app.vue.editorBook.state == 0) 
                {
                    return app.vue.editorBook.title;
                }
            }
        }
    };

    app.removeNotebook = () => 
    {
        axios.post(remove_notebook, 
        {
            id: app.vue.editorBook.id,

        }).then((result) => 
        {
            window.location.href = sharedNotebookPath;
        
        }).catch(() => 
        {
            console.log("Caught error with remove request");
        });
    };

    app.exportNotebook = () => 
    {
        let exportData = [];
        exportData.push(app.vue.editorBook.title);
        exportData.push(app.vue.editorBook.description);


        axios.post(get_notes_all,
        {
            ids: app.vue.editorBook.pages,

        }).then((result) =>
        {
            let noteBigList = result.data.notes;

            for (var i = 0; i < noteBigList.length; i++) 
            {
                let exportPiece = [];
                
                exportPiece.push(app.vue.notePages[i].title);
                exportPiece.push(app.vue.notePages[i].type);
                exportPiece.push(noteBigList[i]);

                exportData.push(exportPiece);
            }

            console.log(exportData);

            var fileName = "notebook data.txt";
            var text = JSON.stringify(exportData);
            text = btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode('0x' + p1);
                }));

            var element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
            element.setAttribute("download", htmlPage + " " + fileName);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
        });
    };

    app.importNotebook = () => 
    {
        let input = app.vue.eventHolder.target;
        let file = input.files[0];
        var my_array;

        file.text().then((result) => 
        {
            result2 = decodeURIComponent(atob(result).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            my_array = JSON.parse(result2);

            axios.post(import_notebook, 
            {
                my_array: my_array,
                parent: notebook_number,

            }).then((result) => 
            {
                window.location.href = app.getLink("notebook");

            }).catch(() => 
            {
                console.log("Caught error");
            });
        });
    };

    app.methods = 
    {
        setValue: app.setValue,
        getValue: app.getValue,
        saveNotebook: app.saveNotebook,
        editNotebook: app.editNotebook,
        deleteNotebook: app.deleteNotebook,
        addNotePage: app.addNotePage,
        saveNotePage: app.saveNotePage,
        getLink: app.getLink,
        setModal: app.setModal,
        getBookTitle: app.getBookTitle,
        removeNotebook: app.removeNotebook,
        exportNotebook: app.exportNotebook,
        importNotebook: app.importNotebook,
    };

    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
    });

    app.init = (someNote) => {
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

            let notebookList = [ parseInt(notebook_number)];

            axios.post(get_notebooks, 
            {
                ids: notebookList,
            
            }).then((result) => 
            {
                if (result.data.notebooks != null) 
                {
                    app.vue.editorBook = result.data.notebooks[0];

                    if (app.vue.user != null && app.vue.editorBook.editors != null) 
                    {
                        if (app.vue.editorBook.editors.indexOf(app.vue.user.email) >= 0) 
                        {
                            app.vue.canEdit = true;
                        }
                    }
                    if (app.vue.editorBook.editors == null) 
                    {
                        app.vue.canEdit = true;
                    }

                    app.vue.notePages = [];

                    axios.post(get_note_pages, 
                    {
                        ids: app.vue.editorBook.pages,

                    }).then((result) => 
                    {
                        if (result.data.notePages != null) 
                        {
                            app.vue.notePages = result.data.notePages;
                        }

                        if (app.vue.user != null && app.vue.editorBook.viewers != null) 
                        {
                            if (app.vue.editorBook.viewers.indexOf(app.vue.user.email) >= 0) 
                            {
                                app.vue.canView = true;
                            }
                        }
                        if (app.vue.editorBook.viewers == null) 
                        {
                            app.vue.canView = true;
                        }

                        if (!app.vue.canView) 
                        {
                            app.vue.notePages = [];
                        }

                        
                        app.vue.showText = true;
                        
                    }).catch(() => 
                    {
                        app.vue.showText = true;
                        console.log("Caught error");
                    });

                    if (app.vue.editorBook.pages.length == 0) 
                    {
                        app.vue.showText = true;

                        if (app.vue.user != null) 
                        {
                            if (app.vue.editorBook.viewers.indexOf(app.vue.user.email) >= 0) 
                            {
                                app.vue.canView = true;
                            }
                        }
                        if (app.vue.editorBook.viewers == null) 
                        {
                            app.vue.canView = true;
                        }
                    }
                } 
                else 
                {
                    app.vue.showText = true;
                    console.log("Invalid notebook");
                }
            
            }).catch(() => 
            {
                console.log("Caught error1");
            });
        
        }).catch(() => 
        {
            console.log("Caught error2");
        });
    };

    app.init(null);
};

init(app);
import uuid
import datetime
import base64
import openpyxl

from py4web import action, request, response, abort, redirect, URL, \
    Field
from py4web.utils.form import Form, FormStyleBulma
from py4web.utils.url_signer import URLSigner

from yatl.helpers import A
from . common import db, session, T, cache, auth, signed_url

url_signer = URLSigner(session)

##Some code cut from here##

@action('user_status', method='GET')
@action.uses(session, db, url_signer.verify())
def getStatus():
    user = None
    userStatus = 0
    if auth.current_user:
        userStatus = 1
        userList1 = db(db.user.email == auth.current_user.get('email')).select().as_list()
        if len(userList1) == 0:
            tempUser = db.user.insert()
        userList2 = db(db.user.email == auth.current_user.get('email')).select().as_list()
        user = userList2[0]
    return dict(userStatus=userStatus, user=user)


@action('save_image/<id>', method='POST')
@action.uses(db, auth.user)
def saveImage(id):
    f = request.files.get('file')
    if f is None:
        db(db.note.id == id).update(image=None)
    else:
        imgBytes = f.file.read()
        b64Image = base64.b64encode(imgBytes).decode('utf-8')
        tempString = 'data:image/jpeg;base64,' + b64Image
        tempArray = [f.filename, tempString]
        db(db.note.id == id).update(image=tempArray)


@action('get_notebooks', method='POST')
@action.uses(session, db, url_signer.verify())
def getNotebooks():
    ids = request.json.get('ids')
    holder = []
    for x in range(len(ids)):
        rows = db(db.notebook.id == ids[x]).select().as_list()
        if len(rows) > 0:
            holder.append(rows[0])
    return dict(notebooks=holder)


@action('save_notebook', method='POST')
@action.uses(session, db, url_signer.verify())
def saveNotebook():
    id = request.json.get('id')
    star = request.json.get('star')
    title = request.json.get('title')
    pages = request.json.get('pages')
    editors = request.json.get('editors')
    viewers = request.json.get('viewers')
    description = request.json.get('description')

    if id == None:
        tempNotebook = db.notebook.insert(
            title=title,
            description=description,
            star=star,
            pages=pages,
            editors=editors,
            viewers=viewers)
        id = tempNotebook.id
        userList = db(db.user.email == auth.current_user.get('email')).select().as_list()
        user = userList[0]
        user['notebooks'].insert(0, id)
        db(db.user.email == auth.current_user.get('email')).update(notebooks=user['notebooks'])
    else:
        db(db.notebook.id == id).update(
            title=title,
            description=description,
            star=star,
            pages=pages,
            editors=editors,
            viewers=viewers)
    return dict(id=id)


@action('delete_notebook', method='POST')
@action.uses(session, db, url_signer.verify())
def deleteNotebook():
    id = request.json.get('id')
    if id == None:
        return dict()
    else:
        userList = db(db.user.email == auth.current_user.get('email')).select().as_list()
        if len(userList) > 0:
            user = userList[0]
            notebookList = user['notebooks']
            for x in range(len(notebookList)):
                if notebookList[x] == int(id):
                    notebookList.pop(x)
                    break
            db(db.user.email == auth.current_user.get('email')).update(notebooks=notebookList)
        db(db.notebook.id == id).delete()
    return dict(id=id)


@action('get_note_pages', method='POST')
@action.uses(session, db, url_signer.verify())
def getNotePages():
    ids = request.json.get('ids')
    holder = []
    for x in range(len(ids)):
        rows = db(db.notePage.id == ids[x]).select().as_list()
        if len(rows) > 0:
            holder.append(rows[0])
    return dict(notePages=holder)


@action('save_note_page', method='POST')
@action.uses(session, db, url_signer.verify())
def saveNotePage():
    notebookId = request.json.get('notebookId')
    id = request.json.get('id')
    title = request.json.get('title')
    star = request.json.get('star')
    notes = request.json.get('notes')
    type = request.json.get('type')

    if id == None:
        tempNotePage = db.notePage.insert(title=title, star=star,notes=notes, type=type, parent=notebookId)
        id = tempNotePage.id
        notebookList = db(db.notebook.id == notebookId).select().as_list()
        tempNotebook = notebookList[0]
        tempNotebook['pages'].append(id)
        db(db.notebook.id == notebookId).update(pages=tempNotebook['pages'])
    else:
        db(db.notePage.id == id).update(title=title, star=star, notes=notes, type=type, parent=notebookId)
    return dict(id=id)


@action('delete_note_page', method='POST')
@action.uses(session, db, url_signer.verify())
def deleteNotePage():
    id = request.json.get('id')
    notebookId = request.json.get('notebookId')
    if id == None:
        return dict()
    else:
        notebookList = db(db.notebook.id == notebookId).select().as_list()
        tempNotebook = notebookList[0]
        notePageList = tempNotebook['pages']
        counter = 0
        for x in notePageList:
            if x == int(id):
                notePageList.pop(counter)
                break
            counter += 1
        db(db.notebook.id == notebookId).update(pages=notePageList)
        db(db.notePage.id == id).delete()
    return dict(id=id)


@action('get_notes', method='POST')
@action.uses(session, db, url_signer.verify())
def getNotes():
    notePage = request.json.get('notePage')
    rows = db(db.note.parent == notePage).select(orderby=db.note.index).as_list()
    for x in range(len(rows)):
        row = rows[x]
        row['showButton1'] = 0
        row['showButton2'] = 0
    return dict(notes=rows)


@action('get_notes_all', method='POST')
@action.uses(session, db, url_signer.verify())
def getNotesAll():
    ids = request.json.get('ids')
    holder = []
    for x in range(len(ids)):
        rows = db(db.note.parent == ids[x]).select(orderby=db.note.index).as_list()
        for y in range(len(rows)):
            row = rows[y]
            row['showButton1'] = 0
            row['showButton2'] = 0
        holder.append(rows)
    return dict(notes=holder)


##Some code cut from here##

@action('delete_note', method='POST')
@action.uses(session, db, url_signer.verify())
def deleteNote():
    id = request.json.get('id')
    parent = request.json.get('parent')
    if id == None:
        return dict()
    else:
        notePageList = db(db.notePage.id == parent).select().as_list()
        tempNotePage = notePageList[0]
        noteList = tempNotePage['notes']
        counter = 0

        for x in noteList:
            if x == int(id):
                noteList.pop(counter)
                break
            counter += 1
        db(db.notePage.id == parent).update(notes=noteList)
        db(db.note.id == id).delete()
    rows = db(db.note.parent == parent).select(orderby=db.note.index)
    for x in range(len(rows)):
        row = rows[x]
        db(db.note.id == row['id']).update(index=x + 1)
    return dict()


@action('remove_notebook', method='POST')
@action.uses(session, db, url_signer.verify())
def removeNotebook():
    id = request.json.get('id')
    if id == None:
        return dict()
    else:
        userList = db(db.user.email == auth.current_user.get('email')).select().as_list()
        if len(userList) > 0:
            user = userList[0]
            notebookList = user['sharedNotebooks']
            for x in range(len(notebookList)):
                if notebookList[x] == int(id):
                    notebookList.pop(x)
                    break
            db(db.user.email == auth.current_user.get('email')).update(sharedNotebooks=notebookList)
        bookList = db(db.notebook.id == id).select().as_list()
        book1 = bookList[0]
        bookViewers = book1['viewers']
        bookEditors = book1['editors']
        userEmail = auth.current_user.get('email')
        if bookViewers != None:
            if userEmail in bookViewers:
                bookViewers.remove(userEmail)
            if userEmail in bookEditors:
                bookEditors.remove(userEmail)
        if bookEditors != None:
            if userEmail in bookEditors:
                bookEditors.remove(userEmail)

        if bookEditors != None and bookEditors != None:
            if len(bookEditors) == 0 and len(bookViewers) == 0:
                db(db.notebook.id == id).delete()
    return dict(id=id)


@action('import_notes_all', method='POST')
@action.uses(session, db, url_signer.verify())
def importNotesAll():
    parent = request.json.get('parent')
    notes = request.json.get('notes')
    if notes == None:
    	return dict()
    for note in notes:
        if note == None:
        	return dict()
    db(db.note.parent == parent).delete()
    for note in notes:
        tempNote = db.note.insert(
            parent=parent,
            level=note['level'],
            state=note['state'],
            tab=note['tab'],
            index=note['index'],
            examples=note['examples'],
            star=note['star'],
            image=note['image'],
            title=note['title'],
            rules=note['rules'])

    return dict()

@action('add_notes_all', method='POST')
@action.uses(session, db, url_signer.verify())
def addNotesAll():
    parent = request.json.get('parent')
    notes = request.json.get('notes')
    if notes == None:
        return dict()
    for note in notes:
        if note == None:
            return dict()
    temp = db(db.note.parent == parent).select().as_list()
    newIndex = len(temp) + 1
    for note in notes:
        tempNote = db.note.insert(
            parent=parent,
            level=note['level'],
            state=note['state'],
            tab=note['tab'],
            index=newIndex,
            examples=note['examples'],
            star=note['star'],
            image=note['image'],
            title=note['title'],
            rules=note['rules'])
        newIndex+=1
    return dict()

##Some code cut from here##
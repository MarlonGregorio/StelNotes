import os
import datetime

from py4web import action, request, abort, redirect, URL, Field
from . common import db, Field, auth
from pydal.validators import *

def getUserEmail():
	return auth.current_user.get('email') if auth.current_user else None

def getUserNameFirst():
    return auth.current_user.get('first_name') if auth.current_user else None

def getUserNameLast():
    return auth.current_user.get('last_name') if auth.current_user else None

def getTime():
    return datetime.datetime.now()

db.define_table("user",
    Field('sharedNotebooks', 'list:integer', default=[]),
    Field('notebooks', 'list:integer', default=[]),
    Field('firstName', default=getUserNameFirst),
    Field('lastName', default=getUserNameLast),
    Field('email', default=getUserEmail),
    Field('postDate', 'datetime', default=getTime),
)

db.define_table("notebook",
    Field('postDate', 'datetime', default=getTime),
    Field('editors', 'list:string', default=[]),
    Field('viewers', 'list:string', default=[]),
    Field('pages', 'list:integer', default=[]),
    Field('description', 'text', default=""),
    Field('owner', default=getUserEmail),
    Field('state', 'integer', default=0),
    Field('star', 'integer', default=0),
    Field('title', 'text', default="")
)

db.define_table("notePage",
    Field('post_date', 'datetime', default=getTime),
    Field('notes', 'list:integer', default=[]),
    Field('parent', 'reference notebook'),
    Field('state', 'integer', default=0),
    Field('star', 'integer', default=0),
    Field('title', 'text', default=""),
    Field('type', 'text', default="")
)

db.define_table("note",
    Field('parent', 'reference notePage'),
    Field('level', 'integer', default=0),
    Field('state', 'integer', default=0), 
    Field('tab', 'integer', default=0),
    Field('index', 'integer', default=0),
    Field('examples', 'text', default=""),
    Field('star', 'integer', default=0),
    Field('image', 'list:string', default=None),
    Field('title', 'text', default=""),
    Field('rules', 'text', default="")
)

db.commit()
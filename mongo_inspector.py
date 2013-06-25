# -*- coding: utf-8 -*-

"""
mongo_inspector
~~~~~~~~~~~~~~~

Schema extractor for MongoDB.

Uses map/reduce over the data of every collection to extract a
representation of its "schema".

Note: the mapped and reduced functions are javascript functions placed
in the 'js' directory.

:copyright: (c) 2013 by Martin Maillard.
:license: MIT, see LICENSE for more details.


TODO:
* What happens with the js files when the library is installed in a
virtualenv ?
* We should probably build a tree of `Attribute`, not have names like
key.child.grandchild... we'll see what we need

* tests
* setup.py
* pypi

"""
import pymongo
from bson.code import Code
from collections import namedtuple


Attribute = namedtuple('Attribute', ['name', 'type'])


def extract_schema(db_name, host='localhost', port=27017):
    client = pymongo.MongoClient(host, port)
    db = client[db_name]

    with open('js/map.js', 'r+') as map_file:
        map_fn = Code(map_file.read())

    with open('js/reduce.js', 'r+') as reduce_file:
        reduce_fn = Code(reduce_file.read())

    collection_structures = {}

    for collection_name in db.collection_names():
        collection = db[collection_name]

        result = collection.inline_map_reduce(map_fn, reduce_fn)
        attributes = [Attribute(val['_id'], val['value']) for val in result]

        collection_structures[collection_name] = attributes

    return collection_structures
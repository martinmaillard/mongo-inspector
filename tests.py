

from pprint import pprint

from mongo_inspector import extract_schema


if __name__ == '__main__':

    schema = extract_schema('hn')

    pprint(schema)

    for collection in schema.values():
        for attr in collection:
            if len(attr.types) > 1:
                print 'Multi-typed attr !'
                print attr

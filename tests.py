

from pprint import pprint

from mongo_inspector import extract_schema


if __name__ == '__main__':

    pprint(extract_schema('hn'))

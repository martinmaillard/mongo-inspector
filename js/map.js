
function map() {

    var inArray = function(item, array) {
        return array.indexOf(item) >= 0;
    };

    var capitalize = function(str) {
        return str[0].toUpperCase() + str.slice(1);
    };

    var type = function(value) {
        var typeStr,
            jsType = typeof value;

        if (jsType !== 'object') {
            typeStr = capitalize(jsType);
        }
        else {
            if (value && value.constructor === Array) {
                typeStr = 'Array';
            }
            else if (value === null) {
                typeStr = 'null';
            }
            else if (value instanceof Date) {
                typeStr = 'Date';
            }
            else if (value instanceof ObjectId) {
                typeStr = 'ObjectId';
            }
            else if (value instanceof NumberLong) {
                typeStr = 'NumberLong';
            }
            else if (value instanceof BinData) {
                var binDataTypes = {
                    0x00: 'generic',
                    0x01: 'function',
                    0x02: 'old',
                    0x03: 'UUID',
                    0x05: 'MD5',
                    0x80: 'user'
                };
                typeStr = 'BinData-' + binDataTypes[thing.subtype()];
            }
            else {
                typeStr = 'Object';
            }
        }

        return typeStr;
    };

    var recurse = function(parent, array, parentType) {
        var key,
            item,
            fullKey,
            base,
            itemType;

        for(key in array) {
            if (array.hasOwnProperty(key)) {
                item = array[key];
                itemType = type(item);

                base = parent === '' ? '' : parent + '.';
                fullKey = parentType === 'Array' ? base + '__item__' : base + key;

                // Emit an object because it needs to be the same type as
                // reduce's output and reduce cannot output an array yet.
                emit(fullKey, {types: [itemType]});

                if (inArray(itemType, ['Object', 'Array'])) {
                    recurse(fullKey, item, itemType);
                }
            }
        }
    };

    recurse('', this);
}

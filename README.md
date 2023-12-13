# squorm
A file format for defining multi-dimensional strokes or gestures in time

### methods

#### addTick(Squirm, { t, x, y, ... })
--> returns a squirm
- Sends warning if t is not bigger than past t
- warns if not all dimensions (t, x, y, z) are not covered
- t is time relative to start time / instantiation / birth / inception / genesis
- MUST contain property t
- t *must* start at 0

```js
const _addTick = (s, payload) => {
    Object.keys(s.data).forEach(key => {
        let newVal = payload[key]
        if (!key in payload) {
            console.warn(`missing data for ${key}, using last value instead`)
        }
        s.data[key].push(newVal)
    })
    return s
}
```



### convertToString( Squirm, options = {} )
--> returns a string

### saveToFile (Squirm, options = { path })
--> return a File handle (?)
*.squirm is added to end of file

### saveToFile ( squirmString, options = { path })
--> return a File handle (?)

### loadFromFile ( File )
--> returns a squirm

### loadFromFile ( path )
--> returns a squirm

### getAt(Squirm, time, {} )
--> returns an object containing { x, t, y } values
?? say time is 0 to 50, we pass in 80 --- does it
wrap: repeat, hallucinate, mirror, clamp // what does it do beyond time?
from:  // what does it do between time? nearest, linear, before, after


## notes and questions after worksession 12.12 (olivia)
- does `actions/saveToFile` need to clone file?
- how to pass path in to `loadFromFile`? i.e. what i imageine wanting to do often is to load a local squirm file
- possible for loadFromFile to use promises or async/await instead of callbacks?
- are we missing the function to generate a squirm from a string representation?
- i think min and max for values other than t should be user defined, so we can get available bounds of "drawing area" (for scaling) rather than just bounds of recorded points. this means we need to re-implement min and max getter and setter
# squorm
A file format for defining multi-dimensional strokes or gestures in time

### methods

#### addTick(Squirm, { t, x, y, ... })
--> returns a squirm
- Sends warning if t is not bigger than past t
- warns if not all dimensions (t, x, y, z) are not covered
- t is time relative to start time / instantiation / birth / inception / genesis 
- MUST contain property t

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

### getAt(Squirm, time )
--> returns an object containing { x, t, y } values
?? say time is 0 to 50, we pass in 80 --- does it 
wrap: repeat, hallucinate, mirror, clamp // what does it do beyond time? 
interpolation:  // what does it do between time? nearest, linear, previous, next



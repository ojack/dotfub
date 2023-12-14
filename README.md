# fubble
A flexible file format for formalizing multi-dimensional paths, strokes, gestures, or [function scribbles](https://ojack.xyz/posts/fubbles/), also known as "fubbles".
Conceptualized and created in Chicago at netizen.org's Artware Incubator with Olivia Jack.

# vernacular of fubbles

## tick
A single moment

## fubble
A continuum of **ticks**

## mob
A collection of **fubbles**
ex: a hand geasture could be made up of finger fubbles). This can be a manifest with metadata (about the relationship between fubbles, including a shared clock) and references/paths to individual dotfub files, or it can be a single file containing all the individual fubble data itself.

### contortion (?)
a change of the thing (buffer)
a mutation or compression of a dotfub file
    - quantizing

### agitation (?)
acting upon (how it's being effected)
    - fubble/mob on fubble/mob

### mime
the act of executing, "running", or "rendering" a fubble. "datamiming"
this can happen a multitude of ways
    - linearly
    - palindrome
    - random (perlin && otherwise)
    - interwoven/intertwingled

### squish
A compressed archive of fubbles or mobs.

### squirmish
An error that results from mobbing fubbles.

#### fubhole
??? mysterious and unpredictable

#### fubbleverse
The ecostystem of fubbles, fubble mobs, agitations

#### fubbleware
Software that services fubbles, ex. the Fubble Inspector

#### fubblecore
A subgenera of Internet art informed by and facilitated by fubbles and the dot fub file format!

## dot fub File Specification

```.fub
~~~
version: 1.0.0
date: 2023~12~06~12:00:00
name:
creator:
device:
location:
license: GPLv3
notes:
mood:
~~~
col t x y z
min 0 -1 0 0
max 6 4 10 10
~ 0.122 43 21 190
~ 0.122 43 21 190
~ 0.1435 33 19 190

~ 0.1677 43 21 190
~ 0.1999 33 19 190
```

- the file should begin with `~~~` to designate the start of the header, followed by metadata (example: version: 1.0.0) and closed with another `~~~`
- the `date` value in the metadata should be relative to the moment the fubble began (not the file's creation time)

- metadata should be followed by a `col` declaration indicating the labels for each column of data which follows
- always begins with col and t
- column t (generally corresponds to time) is a number that is increasing
- other columns are customizable and can be specified by squirm generator
- the `col` delcaration should be followed by a `min` and `max` declaration indicating the min/max values of each column
- a blank line in between lines beginning with ~ indicates a pause or break in continuity

### methods

#### addTick(Squirm, { t, x, y, ... })
--> returns a fubble
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

### convertToString(Fubble, options = {} )
--> returns a string

### saveToFile (Fubble, options = { path })
--> return a File handle (?)
*.squirm is added to end of file

### saveToFile ( fubbleString, options = { path })
--> return a File handle (?)

### loadFromFile ( File )
--> returns a squirm

### loadFromFile ( path )
--> returns a squirm

### getAt(Fubble, time, {} )
--> returns an object containing { x, t, y } values
?? say, time is 0 to 50, we pass in 80 --- does it
wrap: repeat, hallucinate, mirror, clamp // what does it do beyond time?
from:  // what does it do between time? nearest, linear, before, after


# references
1. [Labanotation](https://en.wikipedia.org/wiki/Labanotation) ~ Rudolf von Laban (1920s)
2. [yellow tail](http://www.flong.com/archive/projects/yellowtail/index.html) ~ Golan Levin (1998, rebuilt in Processing in 2007)
3. [What Shall We Do Next? (Sequence #1)](https://vimeo.com/59793317) ~ Julien Prévieux (2006-2011)
4. [tagtool](https://www.tagtool.org/) ~ OMAi GmbH (2008)
5. [MotionBank](https://motionbank.org/#/) ~ Motionbank Project (2010–)
6. [GML - Graffiti Markup Langauge](http://web.archive.org/web/20170910132945/http://www.graffitimarkuplanguage.com/category/projects/) ~ Jamie Wilkinson, Chris Sugrue, Theo Watson, and Evan Roth (2011)
7. [Multi-Touch Painting series](https://www.huffpost.com/entry/evan-roth_n_5670204) ~ Evan Roth (2012 - 2014)
8. [InterFacePainter](http://poxparty.com/InterFacePainter/) ~ PoxParty (2013)
9. [Land Lines](https://experiments.withgoogle.com/land-lines) ~ Zach Lieberman in collaboration with the Data Arts Team at Google (2016)
10. [Boopy](https://www.boopy.club/) ~ Andrew Benson and Giphy (2016)
11. [Norman - VR animated/drawing](https://experiments.withgoogle.com/norman) ~ James Paterson (2017)
12. [Tensor Flow Body Models](https://www.tensorflow.org/js/models#body) ~ TensorFlow.js Team at Google (2018–)
13. [fubbles "function scribbles"](https://ojack.xyz/posts/fubbles/) ~ Olivia Jack (2020)



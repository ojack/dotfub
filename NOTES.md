
## notes and questions after worksession 12.12 (olivia)
- does `actions/saveToFile` need to clone file?
- how to pass path in to `loadFromFile`? i.e. what i imageine wanting to do often is to load a local squirm file
- possible for loadFromFile to use promises or async/await instead of callbacks?
- are we missing the function to generate a squirm from a string representation?
- i think min and max for values other than t should be user defined, so we can get available bounds of "drawing area" (for scaling) rather than just bounds of recorded points. this means we need to re-implement min and max getter and setter
- should we round the squirm data points / have a certain precision?
- probably should restructure repo to have library functions in one place + examples in another, etc etc..
- (for myself) how to reconcile squirms with fubbles in existing projects / how does a squirm relate to a fubble? .. i.e. usually i would call this a 'fubble' in my own projects (https://twitter.com/awwbees/status/1294025917510168578) but then we are doing something additional + adding on so much with the file format and mimeing + cross polination
- our format seems similar to the second version of the keyframe format at: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats

Using this format, the number of elements in each array does not need to be equal. The provided values will be spaced out independently.

```javascript
element.animate(
  {
    opacity: [0, 1], // offset: 0, 1
    backgroundColor: ["red", "yellow", "green"], // offset: 0, 0.5, 1
  },
  2000,
);
```

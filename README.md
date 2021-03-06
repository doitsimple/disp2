# DISP2

[![devDependency Status](https://david-dm.org/doitsimple/disp2/dev-status.svg?theme=shields.io)](https://david-dm.org/doitsimple/disp2-cli#info=devDependencies)
[![Build Status](https://travis-ci.org/doitsimple/disp2.svg?branch=master)](https://travis-ci.org/doitsimple/disp2)

DISP2 is a self-generated templating engine for any language. 

It is essentially a JSON converter, which convert a legal JSON format file to a series of text files. You can define the generation criteria by you own.

For complex criterias, you can event write Javascript in the template file.

Its core function works like advanced m4 language, but based on javascript.

**Features:**

- Pure nodejs (without any dependencies)
- Run on all mainstream OS (like Linux, Windows and Mac)
- Easy to learn (only two grammars)
- Compatible to almost all frameworks (yes, it is)
- Easily extendable (you can write your own modules)

## Install
### Use npm (TODO)
```
npm install --global disp2
```

### Use git
```
git clone https://github.com/doitsimple/disp2
```

## Getting Started

Once installed with npm, you can create a project.json

#### Example `project.json`
```
{
	"env":{
		"name": "Yu",
		"hobby": "cooking"
	}
}
```

Then you can create any file begin with 'disp', like disp2.doc.txt
#### Example `disp2.doc.txt`
```
^^=name$$ likes ^^=hobby$$
```

### Launch command
if installed with npm -g
```
disp2 
```
if cloned with git
```
{path to repo}/bin/disp2
```

### Result
Then you will see a doc.txt
#### Example `doc.txt`
```
Yu likes cooking
```
See `example/1-simple` for the code.

## More examples
### Use Javascript to generate a list
### A 
### Use Javascript to generate a list

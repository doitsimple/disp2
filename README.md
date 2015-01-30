# DISP2

[![devDependency Status](https://david-dm.org/doitsimple/disp2/dev-status.svg?theme=shields.io)](https://david-dm.org/doitsimple/disp2-cli#info=devDependencies)
[![Build Status](https://travis-ci.org/doitsimple/disp2.svg?branch=master)](https://travis-ci.org/doitsimple/disp2)

DISP2 is a self-generated templating engine for any language. 

It's core function works like an advanced m4 language, but based on javascript.

**Features:**

- Pure nodejs (without any dependencies)
- Run on all mainstream OS (like Linux, Windows and Mac)
- Easily to learn (only two grammars)
- Easily extendable (you can write your own modules)

## Install
### Use npm (TODO)
'''
npm install --global disp2
'''

### Use git
'''
git clone https://github.com/doitsimple/disp2
'''

## Getting Started

Once installed with npm, you can create a project.json

### Example `project.json`
'''
{
	"env":{
		"name": "Yu",
		"hobby": "cooking"
	}
}
'''

Then you can create any file begin with 'disp', like disp2.doc.txt
### Example `disp2.doc.txt`
'''
^^=name$$ likes ^^=hobby$$
'''

### Launch command
if installed with npm -g
```
disp2 
```
if cloned with git
```
{path to repo}/bin/disp2
```

Then you will see a doc.txt
'''
Yu likes cooking
'''


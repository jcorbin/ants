%.js: %.coffee
	coffee --compile $<

.PHONY: all clean

all: ant.js eventdispatcher.js expander.js grid.js index.js ruleseditor.js

clean:
	rm -f ant.js eventdispatcher.js expander.js grid.js index.js ruleseditor.js

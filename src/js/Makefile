PROJECT ?= ?

SRC_PATH := src
BUILD_PATH := build

MINIFIER := uglifyjs
MINIFIER_OPTIONS := --mangle --screw-ie8 -p relative

.PHONY: all
all: clean $(BUILD_PATH)/$(PROJECT).min.js

$(BUILD_PATH)/$(PROJECT).min.js: $(BUILD_PATH)/$(PROJECT).js
	echo -n "Minifying javascript... "
	$(MINIFIER) $(MINIFIER_OPTIONS) -o $@ $^
	echo "done"

$(BUILD_PATH)/$(PROJECT).js:
	echo -n "Concatenating javascript sources... "
	mkdir -p $(BUILD_PATH)
	find $(SRC_PATH) -name "config.js" > .files
	find $(SRC_PATH) -name "*.js" -and -not -name "main.js" >> .files
	find $(SRC_PATH) -name "main.js" >> .files
	cat .files | awk '!x[$$0]++' > .files_without_duplicates
	for file in `cat .files_without_duplicates`; do cat $$file; echo; done >> $@
	rm .files .files_without_duplicates
	echo "done"

.PHONY: clean
clean:
	echo -n "Cleaning javascript build... "
	rm -rf $(BUILD_PATH)
	echo "done"

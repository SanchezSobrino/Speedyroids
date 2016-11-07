PROJECT ?= ?

SRC_PATH := src
BUILD_PATH := build

JS_SCRIPTS := $(shell sed -n 's/\s*<script.*src="js\/\(.*[^"]\)"*><\/script>/\1/p' ../$(PROJECT).html | sed -e '/min\.js$$/d')

MINIFIER := uglifyjs
MINIFIER_OPTIONS := --mangle --screw-ie8 -p relative

.PHONY: all
all: clean $(BUILD_PATH)/$(PROJECT).min.js

$(BUILD_PATH)/$(PROJECT).min.js: $(BUILD_PATH)/$(PROJECT).js
	@echo "Minifying javascript:"
	$(MINIFIER) $(MINIFIER_OPTIONS) -o $@ $^
	@echo "done"

$(BUILD_PATH)/$(PROJECT).js:
	@echo "Concatenating javascript sources... "
	@mkdir -p $(BUILD_PATH)
	@for file in $(JS_SCRIPTS); do echo "> Found $$file" 1>&2 ; cat $$file; echo; done >> $@
	@echo "done"

.PHONY: clean
clean:
	@echo -n "Cleaning javascript build... "
	@rm -rfv $(BUILD_PATH)
	@echo "done"

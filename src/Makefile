PROJECT := speedyroids
WWW_PATH := www

export PROJECT

.PHONY: all
all:
	@echo -n "   $$ make <web | generate-android | generate-ios> && make <build-android | build-ios>"

web:
	mkdir -p $(WWW_PATH) $(WWW_PATH)/js $(WWW_PATH)/css
	make -C js/
	cp -uf js/build/$(PROJECT).min.js $(WWW_PATH)/js
	cp -ufr js/libs $(WWW_PATH)/js/
	cp -uf css/$(PROJECT).css $(WWW_PATH)/css
	cp -ufr scenes $(WWW_PATH)/
	{ \
	set -e ;\
	TOTAL_LINES=$$(cat $(PROJECT).html | wc -l) ;\
	BEGIN_LINE=$$(grep -n -e '<!-- BEGIN scripts -->' $(PROJECT).html | cut -d : -f 1) ;\
	END_LINE=$$(grep -n -e '<!-- END scripts -->' $(PROJECT).html | cut -d : -f 1) ;\
	TAIL_LINES=$$(($$TOTAL_LINES-$$END_LINE+1)) ;\
	head -n $$BEGIN_LINE $(PROJECT).html > $(WWW_PATH)/index.html ;\
	echo '    <script type="text/javascript" src="js/$(PROJECT).min.js"></script>' >> $(WWW_PATH)/index.html ;\
	tail -n $$TAIL_LINES $(PROJECT).html >> $(WWW_PATH)/index.html ;\
	}

_generate:
	ln -s $(PWD)/assets/icons/icon.png .

generate-android: web _generate
	cordova platform add android@latest
	./add-plugins.sh android

generate-ios: web _generate
	cordova platform add ios@latest
	./add-plugins.sh ios

_build: web
	cp -uf config.xml $(WWW_PATH)
	cp -uf assets/icons/icon.png $(WWW_PATH)/icon.png

build-android: _build
	cordova build android ;\
	cp platforms/android/build/outputs/apk/android-debug.apk $(PROJECT)-debug.apk

build-ios: _build
	cordova build ios --device

_requirements:
	@sudo npm install -g plugman cordova uglifyjs

install-android-requirements: _requirements

install-ios-requirements: _requirements
	@sudo npm install -g --unsafe-perm=true --allow-root ios-deploy

upgrade-requirements:
	@sudo npm install -g npm@latest
	@sudo npm update -g
	@android update sdk --no-ui

.PHONY: clean
clean:
	cordova platform rm android
	cordova platform rm ios
	rm -rf $(WWW_PATH) platforms/ res/
	rm -f icon.png $(PROJECT)-debug.apk
	make -C js/ clean

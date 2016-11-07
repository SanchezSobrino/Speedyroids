PROJECT := speedyroids
WWW_PATH := www

export PROJECT

.PHONY: all
all:
	@echo "   $$ make <web | generate-android | generate-ios> && make <build-android | build-ios>"

web:
	@mkdir -p $(WWW_PATH) $(WWW_PATH)/js $(WWW_PATH)/css
	make -C js/
	@cp -ufv js/build/$(PROJECT).min.js $(WWW_PATH)/js/
	@cp -ufrv js/libs $(WWW_PATH)/js/
	@cp -ufv css/$(PROJECT).css $(WWW_PATH)/css/
	@cp -ufrv scenes $(WWW_PATH)/
	@{ \
	echo -n "Replacing intermediate scripts for its minified versions... " ;\
	set -e ;\
	TOTAL_LINES=$$(cat $(PROJECT).html | wc -l) ;\
	BEGIN_LINE=$$(grep -n -e '<!-- BEGIN scripts -->' $(PROJECT).html | cut -d : -f 1) ;\
	END_LINE=$$(grep -n -e '<!-- END scripts -->' $(PROJECT).html | cut -d : -f 1) ;\
	TAIL_LINES=$$(($$TOTAL_LINES-$$END_LINE+1)) ;\
	head -n $$BEGIN_LINE $(PROJECT).html > $(WWW_PATH)/index.html ;\
	echo '    <script type="text/javascript" src="js/$(PROJECT).min.js"></script>' >> $(WWW_PATH)/index.html ;\
	tail -n $$TAIL_LINES $(PROJECT).html >> $(WWW_PATH)/index.html ;\
	echo "done" ;\
	}

_generate:
	@ln -sfv $(PWD)/assets/icons/icon.png .

generate-android: web _generate
	cordova platform add android@https://github.com/apache/cordova-android
	./add-plugins.sh android

generate-ios: web _generate
	cordova platform add ios@latest
	./add-plugins.sh ios

_build: web
	@cp -ufv config.xml $(WWW_PATH)
	@cp -ufv assets/icons/icon.png $(WWW_PATH)/icon.png

build-android: _build
	cordova build android ;\
	cp -fv platforms/android/build/outputs/apk/android-debug.apk $(PROJECT)-debug.apk

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

update-b4w:
	@cp -fv ../../../deploy/apps/common/b4w.min.js js/libs/
	@cp -fv ../../../deploy/apps/common/uranium.js js/libs/
	@cp -fv ../../../deploy/apps/common/uranium.js.mem js/libs/

.PHONY: clean
clean:
	cordova platform rm android || true
	cordova platform rm ios || true
	@rm -rfv $(WWW_PATH) platforms/ res/
	@rm -fv icon.png $(PROJECT)-debug.apk
	make -C js/ clean

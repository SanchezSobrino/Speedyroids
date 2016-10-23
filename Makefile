CSS_DIR := css
JS_DIR := js
SRC_DIR := src
WATCHING_FILES := "*.html, ${JS_DIR}/*.js, ${CSS_DIR}/*.css, ${SRC_DIR}/*.html, ${SRC_DIR}/${JS_DIR}/**/*.js, ${SRC_DIR}/${CSS_DIR}/*.css"

.PHONY: serve install-requirements

serve:
	browser-sync start --server --no-notify --files ${WATCHING_FILES}

install-requirements:
	@sudo npm install -g browser-sync


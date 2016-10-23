PROJECT_NAME := speedyroids
CSS_DIR := css
JS_DIR := js

.PHONY: serve install-requirements

serve:
	browser-sync start --server --index ${PROJECT_NAME}.html --no-notify --files "*.html, ${JS_DIR}/**/*.js, ${CSS_DIR}/*.css"

install-requirements:
	@sudo npm install -g browser-sync

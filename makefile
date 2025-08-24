# Makefile for Jekyll project

# Phony targets are not actual files. They are used to define commands.
.PHONY: install serve

# Install project dependencies using Bundler
install:
	bundle install

# Run the Jekyll development server
# This target depends on the 'install' target, so it will run 'install' first.
serve: install
	bundle exec jekyll serve -H 0.0.0.0 -P 3000

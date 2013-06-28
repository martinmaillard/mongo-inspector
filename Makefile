SHELL := /bin/bash

init:
	pip install -r requirements.txt

distribute:
	python setup.py register sdist --formats zip,gztar upload

clean:
	find . -type f -name "*.pyc" -delete;

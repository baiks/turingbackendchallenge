#!/bin/bash

/bin/bash /turing-entrypoint.sh mysqld &
npm run build;
npm start;
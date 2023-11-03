#!/bin/bash

YELLOW='\033[1;33m'
echo -e "${YELLOW}=> Create .npmrc"
aws codeartifact login --tool npm --repository beaconfire-site --domain beaconfire --domain-owner 795824851990 --region us-east-2
cat ~/.npmrc > .npmrc
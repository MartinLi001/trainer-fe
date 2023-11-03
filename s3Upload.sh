#!/bin/bash

JOB_NAME="${JOB_NAME%%_*}"
JOB_DOMAIN="drill-management"

if [[ -z "$(command -v aws)" ]];then
    echo "not existing aws command"
    exit 1
fi

if [[ "$(cat GIT_BRANCH)" == "dev" ]];then
    aws s3 sync dist/ s3://${JOB_DOMAIN}-dev.beaconfireinc.com/
    if [[ $? -eq 0 ]];then
        echo "$JOB_NAME had already deployed"
    else
        echo "$JOB_NAME failed to be deployed"
        exit 1
    fi
fi


if [[ "$(cat GIT_BRANCH)" == "release" || "$(cat GIT_BRANCH)" == "qa" ]];then
    aws s3 sync dist/ s3://${JOB_DOMAIN}-qa.beaconfireinc.com/
    if [[ $? -eq 0 ]];then
        echo "$JOB_NAME had already deployed"
    else
        echo "$JOB_NAME failed to be deployed"
        exit 1
    fi
fi

if [[ "$(cat GIT_BRANCH)" == "master" || "$(cat GIT_BRANCH)" == "main" ]];then
    aws s3 sync dist/ s3://${JOB_DOMAIN}.beaconfireinc.com/
    if [[ $? -eq 0 ]];then
        echo "$JOB_NAME had already deployed"
    else
        echo "$JOB_NAME failed to be deployed"
        exit 1
    fi
fi